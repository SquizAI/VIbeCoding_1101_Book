# Code Generation Prompt Templates

These templates provide structured frameworks for generating code across different development contexts. Modify the parameters in [brackets] to suit your specific needs.

## Basic Component Template

```
I need to create a [component type] for a [application type] application.

Requirements:
- The component should [primary functionality]
- It needs to handle [specific scenarios/edge cases]
- It should be [performance characteristics]
- Style/design requirements: [design specifications]

Technical context:
- Framework: [framework name and version]
- Other technologies: [related technologies]
- Existing patterns: [patterns used in the project]

Please generate:
1. Complete code for the component
2. Brief explanation of design decisions
3. Any necessary CSS/styling
4. Example usage
```

## Algorithm Implementation Template

```
I need to implement an algorithm for [specific purpose].

Problem specification:
- Input: [describe input format and constraints]
- Output: [describe expected output]
- Constraints: [time/space complexity requirements, input size limits]
- Edge cases to handle: [list edge cases]

Technical requirements:
- Language: [programming language]
- Performance criteria: [specific performance needs]
- Error handling approach: [how errors should be handled]

Please provide:
1. A step-by-step explanation of the algorithm
2. Complete implementation with comments
3. Time and space complexity analysis
4. Test cases covering normal operations and edge cases
```

## API Endpoint Template

```
I need to implement a [REST/GraphQL/etc.] API endpoint for [purpose].

Endpoint specifications:
- Method: [GET/POST/PUT/DELETE/etc.]
- Route: [route pattern]
- Request parameters: [query params, body structure]
- Response format: [expected response JSON structure]
- Status codes: [relevant status codes and when to use them]
- Authentication requirements: [auth needs]

Technical context:
- Backend framework: [framework name]
- Database: [database technology]
- Existing models: [relevant data models]
- Validation requirements: [input validation needs]

Please provide:
1. Complete endpoint implementation
2. Validation logic
3. Error handling
4. Sample request and response
5. Brief documentation
```

## Database Query Template

```
I need to write a [database query type] for [purpose].

Query requirements:
- Database: [database type (PostgreSQL, MongoDB, etc.)]
- Tables/collections involved: [list of tables/collections with key fields]
- Relationships: [how tables are related]
- Desired result set: [what data should be returned]
- Sorting/filtering: [ordering and filtering requirements]
- Performance considerations: [any performance constraints]

Sample data structure:
[Provide abbreviated schema or sample documents]

Please generate:
1. The optimized query
2. Explanation of query structure and optimization choices
3. Indexes that should exist to support this query
4. Any relevant transaction handling or locking considerations
```

## Refactoring Template

```
I need to refactor the following code to improve [specific quality: readability, performance, maintainability, etc.].

Current code:
```[language]
[paste code here]
```

Issues with current implementation:
- [Issue 1]
- [Issue 2]
- [Issue 3]

Constraints for refactoring:
- Must maintain the same functionality and API
- Must be compatible with [environments/versions]
- Must follow [coding standards]
- Cannot introduce new dependencies

Please provide:
1. Refactored code with comments explaining changes
2. Summary of improvements made
3. Any trade-offs in your approach
4. Suggestions for further improvements beyond the scope of this refactoring
```

## Test Suite Template

```
I need to create a test suite for the following [function/component/module]:

```[language]
[paste code here]
```

Testing requirements:
- Testing framework: [Jest, Mocha, PyTest, etc.]
- Test coverage targets: [coverage goals]
- Types of tests needed: [unit, integration, etc.]
- Mocking requirements: [external dependencies to mock]
- Edge cases to consider: [list of edge cases]

Application context:
- [relevant application context]
- [environmental details]
- [typical usage patterns]

Please provide:
1. Complete test suite implementation
2. Explanation of test strategy
3. Mock implementations where needed
4. Coverage analysis
```

## Documentation Template

```
I need technical documentation for the following [code/API/component]:

```[language]
[paste code here]
```

Documentation requirements:
- Target audience: [developers, end-users, etc.]
- Documentation style: [reference, tutorial, etc.]
- Format: [markdown, JSDoc, etc.]
- Detail level: [brief overview, comprehensive reference, etc.]

Specific sections needed:
- Overview/Purpose
- Installation/Setup
- API Reference
- Examples
- Troubleshooting
- [any other sections]

Please provide complete documentation following these requirements.
```

## Error Handling Template

```
I need to implement robust error handling for the following code:

```[language]
[paste code here]
```

Error handling requirements:
- Types of errors to handle: [list potential error types]
- Logging requirements: [how errors should be logged]
- User feedback: [how errors should be communicated to users]
- Recovery strategies: [how to recover from different errors]
- Security considerations: [handling sensitive information in errors]

Technical context:
- Environment: [browser, Node.js, etc.]
- Available error handling utilities: [try/catch, error boundaries, etc.]
- Logging infrastructure: [logging systems in place]

Please provide:
1. Updated code with comprehensive error handling
2. Explanation of error handling strategy
3. Examples of how different error scenarios are handled
```

## Performance Optimization Template

```
I need to optimize the following code for [specific performance goal]:

```[language]
[paste code here]
```

Performance issues:
- [Describe current performance problems]
- [Include metrics if available]

Optimization targets:
- [Specific metrics to improve]
- [Constraints (memory usage, etc.)]

Technical context:
- Environment: [browser, server, etc.]
- Scale: [typical usage volume/patterns]
- Bottlenecks identified: [known bottlenecks]
- Profiling data: [if available]

Please provide:
1. Optimized code with comments explaining changes
2. Analysis of expected performance improvements
3. Explanation of optimization techniques used
4. Additional monitoring or profiling suggestions
```

## Security Review Template

```
I need a security review of the following code:

```[language]
[paste code here]
```

Security review focus:
- [Specific security concerns]
- [Compliance requirements if applicable]
- [Threat model considerations]

Technical context:
- Environment: [deployment context]
- User access patterns: [who uses this code]
- Sensitive data handling: [types of data processed]
- Authentication/authorization: [current security measures]

Please provide:
1. Identification of security vulnerabilities
2. Severity assessment for each issue
3. Recommended fixes with code examples
4. Additional security best practices that should be applied
```

## Integration Template

```
I need to integrate [system/service/API] with my application.

Integration requirements:
- Purpose: [what the integration should accomplish]
- API/service documentation: [link or summary of external API]
- Authentication method: [how to authenticate with the service]
- Data flow: [what data is exchanged in which direction]
- Error handling: [how to handle integration failures]

Technical context:
- My application stack: [technologies used]
- Existing integration patterns: [how other integrations are handled]
- Performance requirements: [throughput, latency expectations]
- Reliability needs: [uptime requirements, retry strategies]

Please provide:
1. Integration code with proper error handling
2. Configuration examples
3. Testing approach for the integration
4. Monitoring considerations
```

## State Management Template

```
I need to implement state management for [specific functionality] in my [framework] application.

State requirements:
- State shape: [what data needs to be managed]
- Operations: [actions that modify the state]
- Persistence needs: [if state needs to persist]
- Sharing scope: [components that need access]
- Performance considerations: [update frequency, size, etc.]

Technical context:
- Framework: [React, Vue, Angular, etc.]
- State management options: [Redux, Context API, Vuex, etc.]
- Application size: [scale of the application]
- Existing patterns: [current state management approaches]

Please provide:
1. Recommended state management approach with rationale
2. Implementation code
3. Examples of state operations (CRUD)
4. Integration with components
```

## Custom Hook/Utility Template

```
I need a custom [hook/utility] for [specific purpose] in my [framework] application.

Functionality requirements:
- Primary purpose: [main functionality]
- Input parameters: [what the hook/utility accepts]
- Return value/behavior: [what it provides]
- Edge cases to handle: [special situations]
- Performance considerations: [optimization needs]

Technical context:
- Framework version: [version details]
- Related packages: [relevant ecosystem]
- Usage pattern: [how it will be used]
- Browser/environment support: [compatibility requirements]

Please provide:
1. Complete implementation with TypeScript types
2. Usage examples
3. Edge case handling
4. Testing approach
```

## UI Animation Template

```
I need to implement an animation for [UI element] when [trigger event].

Animation requirements:
- Type: [fade, slide, transition, etc.]
- Duration: [timing]
- Easing: [easing function]
- Responsive behavior: [how it should behave on different devices]
- Accessibility: [a11y considerations]

Technical context:
- Frontend framework: [React, Vue, etc.]
- Animation tools available: [CSS, GSAP, Framer Motion, etc.]
- Browser support: [target browsers]
- Performance constraints: [mobile considerations, etc.]

Please provide:
1. Implementation code
2. Explanation of animation approach
3. Fallback for reduced motion preferences
4. Performance optimization considerations
```

## Microservice Template

```
I need to design a microservice for [specific functionality].

Service requirements:
- Core responsibilities: [what the service does]
- API endpoints needed: [service interface]
- Data model: [entities and relationships]
- Dependencies: [other services it interacts with]
- Non-functional requirements: [performance, scalability, etc.]

Technical context:
- Technology stack: [language, framework]
- Deployment environment: [containerization, orchestration]
- Communication patterns: [sync/async, protocols]
- Existing architecture: [how it fits in the larger system]

Please provide:
1. Service architecture design
2. Key component implementations
3. API contract
4. Data models
5. Deployment considerations
```

---

## Tips for Effective Template Usage

1. **Customize thoroughly**: Replace all placeholder values with specific details
2. **Add context**: Include more project-specific context than you think necessary
3. **Be explicit about constraints**: Clearly state limitations and requirements
4. **Include examples**: Where possible, include examples of similar code from your project
5. **Start broad, then refine**: Use general templates first, then follow up with more specific prompts
6. **Save successful prompts**: When a prompt works well, save it as a personal template
7. **Iterate**: If results aren't optimal, refine your prompt and try again
