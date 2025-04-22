/**
 * Chapter 1: The Vibe Coding Revolution
 * Example: Comparing Traditional vs. Vibe Coding Approaches
 * 
 * This example demonstrates the difference between traditional coding 
 * and AI-assisted Vibe Coding for implementing a data processing utility.
 */

/**
 * Traditional Approach: Manual implementation
 * - Developer must manually implement all logic
 * - Need to remember syntax details
 * - Need to handle edge cases explicitly
 */
function traditionalDataProcessor(data) {
  // Manually validate input
  if (!Array.isArray(data)) {
    throw new TypeError('Input must be an array');
  }
  
  // Manually implement data transformation
  const processed = data.map(item => {
    if (typeof item === 'string') {
      return item.trim().toLowerCase();
    } else if (typeof item === 'number') {
      return Math.round(item * 100) / 100;
    } else if (item === null || item === undefined) {
      return 0;
    } else if (typeof item === 'object') {
      return JSON.stringify(item);
    }
    return String(item);
  });
  
  // Manually implement filtering
  const filtered = processed.filter(item => {
    return item !== 0 && item !== '';
  });
  
  // Manually implement result formatting
  const result = {
    originalCount: data.length,
    processedCount: filtered.length,
    data: filtered,
    timestamp: new Date().toISOString()
  };
  
  return result;
}

/**
 * Vibe Coding Approach: Using AI assistance
 * 
 * The developer would use AI to generate this function by describing 
 * the desired behavior in natural language, for example:
 * 
 * "Create a function that processes an array of mixed data types by:
 * 1. Cleaning strings (trimming and lowercasing)
 * 2. Rounding numbers to 2 decimal places
 * 3. Converting nulls/undefined to 0
 * 4. Converting objects to JSON strings
 * 5. Converting other types to strings
 * 6. Filtering out empty strings and zeros
 * 7. Return an object with counts and timestamp"
 */
function vibeCodingDataProcessor(data) {
  // The AI would generate the implementation like this:
  if (!Array.isArray(data)) {
    throw new TypeError('Input must be an array');
  }
  
  const processed = data
    .map(item => {
      if (typeof item === 'string') return item.trim().toLowerCase();
      if (typeof item === 'number') return Math.round(item * 100) / 100;
      if (item === null || item === undefined) return 0;
      if (typeof item === 'object') return JSON.stringify(item);
      return String(item);
    })
    .filter(item => item !== 0 && item !== '');
  
  return {
    originalCount: data.length,
    processedCount: processed.length,
    data: processed,
    timestamp: new Date().toISOString()
  };
}

// Example usage
const mixedData = [
  '  Hello World  ',
  42.3456,
  null,
  { name: 'Example' },
  undefined,
  true
];

console.log('Traditional approach result:');
console.log(traditionalDataProcessor(mixedData));

console.log('\nVibe Coding approach result:');
console.log(vibeCodingDataProcessor(mixedData));

/**
 * Key Differences Demonstrated:
 * 1. The traditional approach requires manual implementation of all logic
 * 2. The Vibe Coding approach starts with a natural language description
 * 3. The AI-generated code is more concise and uses method chaining
 * 4. Both approaches produce the same result, but the development process is different
 */
