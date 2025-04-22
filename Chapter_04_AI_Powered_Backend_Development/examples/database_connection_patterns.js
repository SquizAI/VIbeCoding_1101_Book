/**
 * Database Connection Patterns for Node.js
 * 
 * This example demonstrates different database connection patterns 
 * for Node.js applications, including connection pooling, 
 * repository pattern, and transaction management.
 */

const { Pool } = require('pg'); // PostgreSQL client
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * PostgreSQL Connection Pool Example
 * 
 * Connection pooling helps manage database connections efficiently
 * by reusing connections rather than creating new ones for each query.
 */
class PostgresConnectionManager {
  constructor(config) {
    this.pool = new Pool({
      user: config.user || process.env.PG_USER,
      host: config.host || process.env.PG_HOST,
      database: config.database || process.env.PG_DATABASE,
      password: config.password || process.env.PG_PASSWORD,
      port: config.port || process.env.PG_PORT || 5432,
      max: config.maxConnections || 20, // Maximum number of clients in the pool
      idleTimeoutMillis: config.idleTimeout || 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: config.connectionTimeout || 2000, // Return an error after 2 seconds if connection not established
      ssl: config.ssl || false
    });

    // Log connection events
    this.pool.on('connect', (client) => {
      console.log('New client connected to database');
    });

    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });

    this.pool.on('remove', () => {
      console.log('Client removed from pool');
    });
  }

  /**
   * Get a client from the pool
   * Use this for transaction management
   */
  async getClient() {
    const client = await this.pool.connect();
    
    // Add helper methods for transaction management
    const originalRelease = client.release;
    client.release = () => {
      client.query = null; // Prevent further use of this client after release
      return originalRelease.call(client);
    };
    
    return client;
  }

  /**
   * Execute a single query and release the client
   * Use this for simple queries
   */
  async query(text, params) {
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Query error', { text, error });
      throw error;
    }
  }

  /**
   * Execute multiple queries within a transaction
   */
  async executeTransaction(callback) {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Execute the callback, passing in the client
      const result = await callback(client);
      
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Close the pool and all clients
   */
  async close() {
    await this.pool.end();
    console.log('All pool connections closed');
  }
}

/**
 * MongoDB Connection Management Example
 * 
 * This demonstrates best practices for connecting to MongoDB
 * with mongoose, including connection options and event handling.
 */
class MongoConnectionManager {
  constructor(config) {
    this.config = {
      uri: config.uri || process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: config.serverSelectionTimeoutMS || 5000,
        socketTimeoutMS: config.socketTimeoutMS || 45000,
        maxPoolSize: config.maxPoolSize || 10, // Maximum number of connections in the pool
        minPoolSize: config.minPoolSize || 1, // Minimum number of connections in the pool
        connectTimeoutMS: config.connectTimeoutMS || 10000,
        ...config.options
      }
    };
    
    this.isConnected = false;
    this.connection = null;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    if (this.isConnected) {
      return this.connection;
    }

    try {
      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
        this.isConnected = true;
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await this.close();
        process.exit(0);
      });

      // Connect to MongoDB
      this.connection = await mongoose.connect(
        this.config.uri, 
        this.config.options
      );
      
      return this.connection;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  /**
   * Close MongoDB connection
   */
  async close() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('MongoDB connection closed');
    }
  }
}

/**
 * Repository Pattern Example
 * 
 * The repository pattern abstracts the data access layer
 * from the rest of the application. This example implements
 * a generic repository for PostgreSQL.
 */
class PostgresRepository {
  constructor(connectionManager, tableName, primaryKeyField = 'id') {
    this.connectionManager = connectionManager;
    this.tableName = tableName;
    this.primaryKeyField = primaryKeyField;
  }

  /**
   * Find all records, optionally filtered
   */
  async findAll(filters = {}, options = {}) {
    const whereConditions = [];
    const queryParams = [];
    let paramIndex = 1;
    
    // Build WHERE clause from filters
    Object.entries(filters).forEach(([key, value]) => {
      whereConditions.push(`${key} = $${paramIndex}`);
      queryParams.push(value);
      paramIndex++;
    });
    
    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';
      
    // Handle sorting
    const orderBy = options.orderBy 
      ? `ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`
      : '';
      
    // Handle pagination
    const limit = options.limit ? `LIMIT ${options.limit}` : '';
    const offset = options.offset ? `OFFSET ${options.offset}` : '';
    
    const query = `
      SELECT * FROM ${this.tableName}
      ${whereClause}
      ${orderBy}
      ${limit}
      ${offset}
    `;
    
    const result = await this.connectionManager.query(query, queryParams);
    return result.rows;
  }

  /**
   * Find a record by primary key
   */
  async findById(id) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ${this.primaryKeyField} = $1
    `;
    
    const result = await this.connectionManager.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Insert a new record
   */
  async create(data) {
    const columns = Object.keys(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = columns.map(col => data[col]);
    
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await this.connectionManager.query(query, values);
    return result.rows[0];
  }

  /**
   * Update an existing record
   */
  async update(id, data) {
    const columns = Object.keys(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 2}`);
    const values = [...columns.map(col => data[col]), id];
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause.join(', ')}
      WHERE ${this.primaryKeyField} = $1
      RETURNING *
    `;
    
    const result = await this.connectionManager.query(query, [id, ...values.slice(0, -1)]);
    return result.rows[0] || null;
  }

  /**
   * Delete a record
   */
  async delete(id) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE ${this.primaryKeyField} = $1
      RETURNING *
    `;
    
    const result = await this.connectionManager.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Execute a transaction with multiple operations
   */
  async transaction(callback) {
    return this.connectionManager.executeTransaction(async (client) => {
      // Create a transactional version of the repository
      const transactionalRepo = new PostgresRepository({
        query: (text, params) => client.query(text, params)
      }, this.tableName, this.primaryKeyField);
      
      // Execute the callback with the transactional repository
      return callback(transactionalRepo);
    });
  }
}

/**
 * Example Mongoose Schema and Model Pattern
 */
// User schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Email validation with regex
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  lastLogin: Date,
  // Timestamps option adds createdAt and updatedAt fields automatically
}, { timestamps: true });

// Indexes for performance optimization
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// Instance method example
userSchema.methods.getFullName = function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
};

// Static method example
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Virtual property example
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save middleware example
userSchema.pre('save', function(next) {
  // Do something before saving
  if (this.isModified('email')) {
    // Email changed, perform additional validation or actions
  }
  next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

/**
 * MongoDB Repository Pattern Example
 * 
 * Although Mongoose models already provide repository-like functionality,
 * sometimes a repository layer can provide additional abstraction and business logic.
 */
class UserRepository {
  constructor() {
    this.model = User;
  }

  /**
   * Find all users, with optional filtering
   */
  async findAll(filters = {}, options = {}) {
    const query = this.model.find(filters);
    
    // Apply pagination
    if (options.limit) {
      query.limit(options.limit);
    }
    
    if (options.skip) {
      query.skip(options.skip);
    }
    
    // Apply sorting
    if (options.sort) {
      query.sort(options.sort);
    }
    
    // Specify fields to include/exclude
    if (options.select) {
      query.select(options.select);
    }
    
    // Populate related documents
    if (options.populate) {
      query.populate(options.populate);
    }
    
    return query.exec();
  }

  /**
   * Find user by ID
   */
  async findById(id, options = {}) {
    const query = this.model.findById(id);
    
    if (options.select) {
      query.select(options.select);
    }
    
    if (options.populate) {
      query.populate(options.populate);
    }
    
    return query.exec();
  }

  /**
   * Create a new user
   */
  async create(data) {
    const user = new this.model(data);
    return user.save();
  }

  /**
   * Update a user
   */
  async update(id, data, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  /**
   * Delete a user
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Execute operations in a transaction
   */
  async transaction(callback) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

/**
 * Usage Examples
 */

// PostgreSQL example usage
async function postgresExample() {
  const connectionManager = new PostgresConnectionManager({
    user: 'postgres',
    host: 'localhost',
    database: 'example_db',
    password: 'postgres',
    port: 5432
  });
  
  const userRepository = new PostgresRepository(connectionManager, 'users');
  
  try {
    // Find all active users
    const activeUsers = await userRepository.findAll({ is_active: true }, { 
      orderBy: 'created_at',
      orderDirection: 'DESC',
      limit: 10
    });
    console.log('Active users:', activeUsers);
    
    // Find user by ID
    const user = await userRepository.findById(1);
    console.log('User:', user);
    
    // Create a new user
    const newUser = await userRepository.create({
      username: 'john_doe',
      email: 'john@example.com',
      password_hash: 'hashed_password',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('New user created:', newUser);
    
    // Update a user
    const updatedUser = await userRepository.update(1, { 
      email: 'john.updated@example.com'
    });
    console.log('Updated user:', updatedUser);
    
    // Transaction example - create user and profile
    await connectionManager.executeTransaction(async (client) => {
      // Create a user
      const result = await client.query(
        'INSERT INTO users(username, email) VALUES($1, $2) RETURNING id',
        ['jane_doe', 'jane@example.com']
      );
      const userId = result.rows[0].id;
      
      // Create a profile for the user
      await client.query(
        'INSERT INTO profiles(user_id, first_name, last_name) VALUES($1, $2, $3)',
        [userId, 'Jane', 'Doe']
      );
      
      return userId;
    });
  } finally {
    // Close the connection pool
    await connectionManager.close();
  }
}

// MongoDB example usage
async function mongoExample() {
  const connectionManager = new MongoConnectionManager({
    uri: 'mongodb://localhost:27017/example_db'
  });
  
  try {
    await connectionManager.connect();
    const userRepository = new UserRepository();
    
    // Find all active users
    const activeUsers = await userRepository.findAll(
      { isActive: true },
      { 
        sort: { createdAt: -1 },
        limit: 10,
        select: 'username email profile.firstName profile.lastName'
      }
    );
    console.log('Active users:', activeUsers);
    
    // Find user by ID
    const user = await userRepository.findById('user_id_here');
    console.log('User:', user);
    
    // Create a new user
    const newUser = await userRepository.create({
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: 'hashed_password',
      profile: {
        firstName: 'John',
        lastName: 'Doe'
      }
    });
    console.log('New user created:', newUser);
    
    // Update a user
    const updatedUser = await userRepository.update('user_id_here', { 
      email: 'john.updated@example.com'
    });
    console.log('Updated user:', updatedUser);
    
    // Transaction example
    await userRepository.transaction(async (session) => {
      // Create a user
      const user = await userRepository.create({
        username: 'jane_doe',
        email: 'jane@example.com',
        passwordHash: 'hashed_password'
      }, { session });
      
      // Create a post for the user (assuming we have a PostRepository)
      const postRepository = new PostRepository();
      await postRepository.create({
        userId: user._id,
        title: 'My First Post',
        content: 'Hello world!'
      }, { session });
      
      return user;
    });
  } finally {
    // Close the connection
    await connectionManager.close();
  }
}

/**
 * Best Practices Demonstrated:
 * 
 * 1. Connection pooling for efficient database connections
 * 2. Repository pattern for data access abstraction
 * 3. Transaction management for data integrity
 * 4. Error handling and proper connection cleanup
 * 5. Parameterized queries to prevent SQL injection
 * 6. Mongoose schema validation and middleware
 * 7. Structured approach to database operations
 * 8. Separation of concerns between connection management and repositories
 */

module.exports = {
  PostgresConnectionManager,
  MongoConnectionManager,
  PostgresRepository,
  UserRepository
};
