# Advanced Prompt Engineering: Advanced Level

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-e74c3c?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_6-e74c3c?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 6" />
  <h1>Advanced Prompt Engineering: Advanced Level</h1>
  
  <p><i>"Mastering the art of precision communication with AI"</i></p>
</div>

<div align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/📋_Overview-teal?style=flat-square" /></a> •
  <a href="./Chapter_06_Beginner.md"><img src="https://img.shields.io/badge/🌱_Beginner-green?style=flat-square" /></a> •
  <a href="./Chapter_06_Advanced.md"><img src="https://img.shields.io/badge/🔧_Advanced-blue?style=flat-square" /></a> •
  <a href="./Chapter_06_Ninja.md"><img src="https://img.shields.io/badge/⚡_Ninja-purple?style=flat-square" /></a> •
  <a href="./Further_Reading.md"><img src="https://img.shields.io/badge/📚_Resources-orange?style=flat-square" /></a>
</div>

<hr/>

## Professional-Grade Prompt Engineering

For developers with intermediate experience, this guide expands on fundamental concepts to deliver professional-grade prompt engineering techniques. You'll learn how to craft prompts that produce precise, maintainable, and well-architected code—skills essential for professional software development.

## The RECIPE Framework for Effective Prompts

The RECIPE framework provides a systematic approach to prompt construction that yields consistent, high-quality results:

### R - Role and Context

Establish the AI's role and provide relevant project context:

```
You are acting as an experienced TypeScript developer specializing in React performance optimization. 

Project context: I'm building a data visualization dashboard that renders multiple interactive charts using D3.js within a React application. The dashboard needs to handle real-time updates from a WebSocket connection and maintain smooth interactions even with large datasets.
```

### E - Expertise Level

Explicitly specify both your expertise level and the desired level of the response:

```
My expertise: I have 2 years of React experience but limited experience with D3.js and performance optimization.

Response level: Please provide explanations alongside the code and highlight performance-critical decisions. Assume I'm familiar with React hooks and TypeScript generics.
```

### C - Constraints and Requirements

Define technical constraints and specific requirements:

```
Technical constraints:
- Must be compatible with React 18 and TypeScript 4.5+
- Must support SSR with Next.js
- Bundle size is a concern; minimize dependencies
- Must meet WCAG 2.1 AA accessibility standards

Requirements:
- Charts should re-render efficiently when data updates
- Interactions must remain responsive with datasets of up to 10,000 points
- Chart components should be reusable across the application
```

### I - Input/Output Examples

Provide examples of expected inputs and outputs:

```
Sample input data structure:
```json
[
  { "timestamp": "2023-05-01T12:00:00Z", "value": 145.32, "category": "A" },
  { "timestamp": "2023-05-01T12:05:00Z", "value": 147.21, "category": "B" }
]
```

Expected component usage:
```tsx
<TimeSeriesChart 
  data={timeSeriesData} 
  dimensions={{ width: 800, height: 400 }}
  options={{ 
    xAccessor: d => new Date(d.timestamp),
    yAccessor: d => d.value,
    colorAccessor: d => d.category
  }}
  onPointHover={handlePointHover}
/>
```
```

### P - Previous Code and Patterns

Include relevant existing code and established patterns:

```
Our project follows these patterns:
- We use a custom hook for data fetching: `useDataSource`
- Component styling uses Styled Components with this theme structure:
```tsx
const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f8f9fa',
    text: '#2c3e50'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px'
  }
}
```

Here's our current chart container component that needs optimization:
```tsx
const ChartContainer: React.FC<Props> = ({ data, type }) => {
  // Current implementation with performance issues
  return (
    <div className="chart-wrapper">
      {type === 'line' ? <LineChart data={data} /> : <BarChart data={data} />}
    </div>
  );
};
```
```

### E - Evaluation Criteria

Define how success will be measured:

```
Success criteria:
1. Chart should render in under 300ms for 5,000 data points (measured with React profiler)
2. Interactions (hover, zoom) should respond in under 50ms
3. Re-renders on data updates should be visibly smooth
4. Memory usage should not increase over time with continuous updates
5. Component API should be consistent with existing patterns
```

## Advanced Technical Prompt Techniques

### 1. Controlled Statefulness in Conversation

Manage the state of a conversation to build complex solutions incrementally:

```
This is part 3 of our ongoing implementation of the real-time dashboard. In part 1, we created the base chart components. In part 2, we implemented the data transformation utilities.

For this part, focus on the WebSocket integration for real-time updates. Reference our previous work on throttling updates to avoid performance issues.

Please continue with the WebSocket manager class implementation according to the architecture diagram we established.
```

### 2. Dual Implementation with Comparative Analysis

Request multiple implementations to gain deeper insights:

```
Please provide two different approaches to implement pagination for our API responses:

1. Offset-based pagination with limit/offset parameters
2. Cursor-based pagination with page tokens

For each approach, include:
- Implementation details (backend and frontend code)
- Performance characteristics
- Edge cases and how they're handled
- Suitability for our specific use case (real-time data with frequent updates)

After presenting both implementations, provide a comparative analysis and recommendation.
```

### 3. Systematic Error Handling Strategy

Request comprehensive error handling strategies:

```
For our authentication service (code below), please develop a complete error handling strategy:

```typescript
class AuthenticationService {
  async login(credentials: Credentials): Promise<UserSession> {
    // implementation
  }
  
  async refreshToken(token: string): Promise<UserSession> {
    // implementation
  }
  
  async logout(userId: string): Promise<void> {
    // implementation
  }
}
```

For each method, please provide:
1. Custom error classes with appropriate inheritance hierarchy
2. Error categorization (client errors vs. server errors)
3. Recovery strategies for each error type
4. Logging considerations (what to log at what level)
5. User-facing error messages and localization strategy
6. How errors should propagate through the application
```

### 4. Incremental Complexity Navigation

Break down complex problems by progressively adding complexity:

```
Let's design a file upload system with resume capability. Let's approach this in stages:

Stage 1: First, show me a basic file upload implementation with progress tracking

Stage 2: After I review stage 1, we'll add chunk-based uploading

Stage 3: Then we'll implement persistence to enable resuming interrupted uploads

Stage 4: Finally, we'll add integrity verification and error recovery

For now, please implement Stage 1 with clean, well-structured code.
```

### 5. Architecture-Focused Prompting

Focus on architectural concerns before implementation details:

```
Before implementing our event sourcing system, I need an architecture design:

1. Define the core domain models and commands
2. Design the event schema with versioning strategy
3. Outline the event store interface and implementation options
4. Design the projection system for read models
5. Specify how consistency boundaries work across aggregates

Please provide each section with diagrams (as ASCII if needed) and explain architectural decisions and trade-offs.

After we agree on the architecture, we'll move to implementation details.
```

## Professional Implementation Examples

### Example 1: Custom Hook with Performance Optimization

**Prompt:**
```
I need to create a custom React hook called useDataFetching that fetches and caches API data with the following requirements:

- Should handle loading, error, and success states
- Should implement caching to avoid redundant fetches
- Should support request cancellation when component unmounts
- Should provide a refetch mechanism
- Should use TypeScript with proper generic typing
- Should work with React 18's concurrent features
- Should include stale-while-revalidate behavior

Please provide a professional implementation with comments explaining key decisions.
```

**What makes this effective**: The prompt is specific about the hook's name, functionality, and technical requirements. It requests proper typing and compatibility with specific React features, giving the AI clear constraints.

### Example 2: API Design with Authentication

**Prompt:**
```
I'm designing a RESTful API for a task management system. The API needs:

- Resource endpoints for users, projects, tasks, and comments
- JWT-based authentication with refresh token rotation
- Role-based access control (admin, manager, member)
- Rate limiting and throttling
- Consistent error responses
- Pagination and filtering
- Proper HTTP method usage
- Versioning strategy

Current tech stack:
- Node.js with Express
- PostgreSQL database
- Deployed on AWS with ECS

Please provide:
1. API route structure with endpoints
2. Authentication flow implementation
3. Authorization middleware
4. Rate limiting implementation
5. Example controller for tasks with all CRUD operations
6. Error handling middleware
7. Sample response formats including errors
```

**What makes this effective**: The prompt details specific API components, security requirements, and contextualizes the request within the existing tech stack. It breaks down deliverables into clear sections.

### Example 3: Optimizing Database Queries

**Prompt:**
```
I need to optimize the following PostgreSQL queries that are causing performance issues in our application:

```sql
-- Query 1: This takes ~3 seconds to run with ~100,000 records
SELECT u.username, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id
ORDER BY total_spent DESC;

-- Query 2: This frequently times out
SELECT p.name, p.price, p.category, 
  (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) as times_ordered,
  (SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.id) as avg_rating
FROM products p
WHERE p.is_active = true;
```

Current database stats:
- users table: ~500,000 rows, indexed on id, email
- orders table: ~2 million rows, indexed on id, user_id
- products table: ~50,000 rows, indexed on id
- order_items table: ~5 million rows, indexed on id, order_id
- reviews table: ~300,000 rows, indexed on id, product_id

I need optimized versions of these queries with explanations of:
1. The performance issues in the original queries
2. The optimization techniques applied
3. Any schema changes or indexes that should be added
4. Expected performance improvements
```

**What makes this effective**: The prompt includes the actual queries, provides context about table sizes and existing indexes, and specifies the detailed explanation expected with the optimization.

## Advanced Prompt Patterns in Professional Workflows

### Blueprint-First Development

```
I'm implementing a document collaboration feature similar to Google Docs. Before writing code, I need a comprehensive blueprint covering:

1. Data model design:
   - Document storage schema
   - Real-time collaboration data structures
   - Conflict resolution approach

2. System architecture:
   - Client-side components
   - Server-side services
   - Communication protocols

3. Key algorithms:
   - Operational transformation or CRDT implementation
   - Differential synchronization approach
   - Presence and cursor tracking

4. Technical constraints:
   - Must work in browsers without WebSocket support (fallback)
   - Must handle offline mode
   - Must support at least 20 concurrent editors

Please provide this blueprint with diagrams (ASCII format is fine) and highlight decision points where alternative approaches exist.
```

### Code Review and Analysis

```
Please review this React component for:

```tsx
const UserDashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Welcome, {userData?.name}</h1>
      <div className="dashboard-stats">
        {userData?.stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

Your review should include:
1. Code quality assessment
2. Potential bugs or edge cases
3. Performance implications
4. Accessibility concerns
5. Security considerations
6. Refactoring suggestions with improved code
7. Best practices that are missing

Focus on practical improvements without over-engineering.
```

### Technical Documentation Generation

```
I need to create technical documentation for our payment processing module. The documentation needs to cover:

1. Architecture overview
2. Key components and their responsibilities
3. API reference with examples
4. Configuration options
5. Security considerations
6. Error handling strategy
7. Integration guides for common scenarios
8. Performance characteristics and optimization tips

Here's the main PaymentProcessor class and its key dependencies:

```typescript
export class PaymentProcessor {
  constructor(
    private gateway: PaymentGateway,
    private logger: Logger,
    private config: PaymentConfig
  ) {}
  
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    // Implementation
  }
  
  async refundPayment(refundRequest: RefundRequest): Promise<RefundResult> {
    // Implementation
  }
  
  // Other methods...
}

export interface PaymentGateway {
  authorize(amount: Money, paymentMethod: PaymentMethod): Promise<AuthorizationResult>;
  capture(authorizationId: string, amount?: Money): Promise<CaptureResult>;
  void(authorizationId: string): Promise<VoidResult>;
  refund(transactionId: string, amount?: Money): Promise<RefundResult>;
}
```

Please generate comprehensive markdown documentation suitable for our developer portal.
```

## Prompt Maintenance in Team Environments

### Prompt Versioning

As your prompt library grows, implement versioning to track changes and improvements:

```
# Payment Processing API Prompt v2.3
# Updated: 2023-09-15
# Changes from v2.2:
# - Added support for the new fraud detection integration
# - Improved error handling examples
# - Updated to reflect API version 3.4 changes

I need to implement a payment processing integration with the following requirements...
```

### Prompt Libraries with Context Inheritance

Create modular prompts that can be composed together:

```
# Include: project-context.prompt
# Include: typescript-standards.prompt
# Include: testing-requirements.prompt

I need to implement a user authentication module that...
```

### A/B Testing Prompts

Systematically improve prompts by testing variations:

```
# Prompt Variant A - Procedural
I need a function that takes an array of transaction objects and returns the sum of all transactions within a date range.

# Prompt Variant B - Domain-Focused
I need a function that calculates the total revenue from a collection of transactions that occurred between two dates.

# Prompt Variant C - Implementation-Detailed
I need a TypeScript function that accepts an array of Transaction objects (with date and amount properties) and two Date parameters (startDate and endDate). It should return the sum of the amount property for all transactions where the date is within the inclusive range.
```

## Conclusion

Mastering advanced prompt engineering requires combining technical precision with clear communication. By using structured frameworks like RECIPE, implementing professional patterns, and maintaining a systematic approach to prompt development, you can dramatically improve the quality and consistency of AI-generated solutions.

For professional developers, investing time in refining these skills yields significant returns in productivity, code quality, and architectural outcomes. Consistent, well-crafted prompts lead to better software design, more maintainable codebases, and more efficient development workflows.

<hr/>

<div align="center">
  <h3>🧭 Continue Your Learning Journey</h3>
</div>

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <a href="./Chapter_06_Beginner.md">
          <img src="https://img.shields.io/badge/🌱_BEGINNER-green?style=for-the-badge&logo=openaigym&logoColor=white" alt="Beginner" />
        </a>
        <p>Foundational concepts with<br/>straightforward examples</p>
      </td>
      <td align="center" width="33%">
        <a href="./Chapter_06_Advanced.md">
          <img src="https://img.shields.io/badge/🔧_ADVANCED-blue?style=for-the-badge&logo=expertvoice&logoColor=white" alt="Advanced" />
        </a>
        <p>Professional implementation<br/>with best practices</p>
      </td>
      <td align="center" width="33%">
        <a href="./Chapter_06_Ninja.md">
          <img src="https://img.shields.io/badge/⚡_NINJA-purple?style=for-the-badge&logo=ninjaforms&logoColor=white" alt="Ninja" />
        </a>
        <p>Cutting-edge techniques<br/>for experts</p>
      </td>
    </tr>
  </table>
</div>

<div align="center">
  <h3>📚 Practical Resources</h3>
</div>

<div align="center">
  <a href="./examples"><img src="https://img.shields.io/badge/💻_Code_Examples-teal?style=flat-square" alt="Examples" /></a> •
  <a href="./exercises"><img src="https://img.shields.io/badge/🏋️_Practice_Exercises-coral?style=flat-square" alt="Exercises" /></a> •
  <a href="./prompt_templates"><img src="https://img.shields.io/badge/🛠️_Prompt_Templates-gold?style=flat-square" alt="Resources" /></a> •
  <a href="./Further_Reading.md"><img src="https://img.shields.io/badge/📖_Further_Reading-sky?style=flat-square" alt="Further Reading" /></a>
</div>

<div align="center">
  <h3>🧙‍♂️ Navigate Chapters</h3>
</div>

<div align="center">
  <a href="../Chapter_05_Full_Stack/README.md"><img src="https://img.shields.io/badge/⬅️_Previous_Chapter-9b59b6?style=for-the-badge" alt="Previous Chapter" /></a>
  <a href="./README.md"><img src="https://img.shields.io/badge/📋_Chapter_Overview-teal?style=for-the-badge" alt="Chapter Overview" /></a>
  <a href="../Chapter_07_Testing_and_Debugging/README.md"><img src="https://img.shields.io/badge/Next_Chapter_➡️-green?style=for-the-badge" alt="Next Chapter" /></a>
</div>

<div align="center">
  <a href="../../README.md"><img src="https://img.shields.io/badge/🏠_Course_Home-pink?style=flat-square" alt="Course Home" /></a>
</div>

<div align="center">
  <p><em>© 2025 Vibe Coding. Transform the way you build software with AI-human collaboration!</em></p>
</div>
