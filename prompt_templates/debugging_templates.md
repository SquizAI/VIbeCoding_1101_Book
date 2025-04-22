# Debugging Prompt Templates

These templates are designed to help you effectively leverage AI assistance when debugging code issues. Modify the parameters in [brackets] to fit your specific debugging scenario.

## General Debugging Template

```
I'm debugging an issue with [brief description of the problem].

Code with the issue:
```[language]
[paste problematic code here]
```

Error message or unexpected behavior:
```
[paste exact error message or describe the behavior in detail]
```

Expected behavior:
[describe what should happen when the code works correctly]

Environment:
- Language/Runtime: [version details]
- Framework: [framework and version]
- Platform: [OS, browser, device, etc.]
- Dependencies: [relevant libraries and versions]

What I've tried so far:
- [debugging step 1]
- [debugging step 2]
- [debugging step 3]

Please help me:
1. Identify the root cause of this issue
2. Suggest a solution with explanation
3. Provide any relevant debugging tips for similar issues in the future
```

## Syntax Error Template

```
I'm getting a syntax error in my [language] code that I can't resolve.

Error message:
```
[paste exact error message]
```

Code with error:
```[language]
[paste code with error, including several lines before and after the problematic line]
```

Line number (if available): [line number]

My understanding of the issue:
[your interpretation of what might be wrong]

Language/environment version:
- [language/runtime version]
- [relevant compiler/interpreter flags]

Please help me:
1. Identify the exact syntax error
2. Explain why it's an error in this language
3. Provide the corrected code
4. Share any syntax rules or best practices I should be aware of
```

## Runtime Error Template

```
I'm encountering a runtime error in my [language/framework] application.

Error details:
```
[paste complete error stack trace]
```

Code that triggers the error:
```[language]
[paste relevant code sections]
```

Context:
- When this occurs: [when the error happens]
- Frequency: [how often it occurs]
- Reproducibility: [steps to reproduce or conditions]

Environment:
- [language/runtime version]
- [framework version]
- [system information]
- [relevant configuration]

Debug information:
- [any logging output]
- [variable values at time of error if available]
- [memory usage or performance metrics if relevant]

What I've already ruled out:
- [things you've already checked]

Please analyze this error and provide:
1. Likely root cause explanation
2. Solution to fix the issue
3. Recommendations for better error handling
4. Suggestions for preventing similar errors
```

## Logic Error Template

```
I have a logic error in my [language] code where [brief description of incorrect behavior].

Current code:
```[language]
[paste the code with the logic error]
```

Expected behavior:
[what the code should do]

Actual behavior:
[what the code actually does]

Test cases:
- Input: [test input]
  - Expected output: [what should happen]
  - Actual output: [what actually happens]
- [additional test cases as needed]

Debugging steps taken:
- [what you've tried so far]
- [relevant variable values or state]

Please help me:
1. Analyze the logic flow
2. Identify where the logic diverges from the expected behavior
3. Provide a corrected implementation
4. Explain the underlying logical issue
```

## Performance Issue Template

```
I'm experiencing performance problems with the following [language] code:

```[language]
[paste code with performance issues]
```

Performance symptoms:
- [specific performance metrics]
- [where bottlenecks appear to be]
- [under what conditions the performance degrades]

Profiling data (if available):
```
[paste profiling output or metrics]
```

System context:
- [hardware/environment details]
- [scale of data being processed]
- [concurrency/load information]

Performance requirements:
- [target execution time]
- [resource constraints]
- [scalability needs]

What I've attempted:
- [optimization strategies already tried]
- [results of those attempts]

Please analyze this code for performance issues and provide:
1. Identification of performance bottlenecks
2. Optimization strategies specific to this code
3. Refactored code implementing these optimizations
4. Explanation of why these changes should improve performance
```

## Memory Leak Template

```
I suspect a memory leak in my [language/framework] application.

Symptoms:
- [memory usage patterns]
- [performance degradation over time]
- [error messages related to memory]

Relevant code:
```[language]
[paste suspected problematic code]
```

Memory profiling information (if available):
```
[paste memory profiler output]
```

Application lifecycle:
- [how long the application runs]
- [what operations occur before memory issues]
- [whether restarting resolves temporarily]

Environment:
- [language/runtime version]
- [system information]
- [memory constraints]

Please help me:
1. Identify potential sources of memory leaks
2. Explain memory management concepts relevant to this issue
3. Provide fixes for the problematic code
4. Suggest monitoring and prevention strategies
```

## Asynchronous Code Debugging Template

```
I'm having trouble with asynchronous code in [language/framework].

Issue description:
[detailed description of the async problem]

Problematic code:
```[language]
[paste code with async issues]
```

Expected sequence of operations:
1. [first expected step]
2. [second expected step]
3. [etc.]

Actual behavior:
[what actually happens in what order]

Error messages (if any):
```
[paste error messages]
```

Environment:
- [language/framework version]
- [relevant libraries (Promise, async/await, etc.)]

Debugging attempts:
- [what you've already tried]
- [logging results if available]

Please help me:
1. Explain the flow of execution in this asynchronous code
2. Identify where the expected and actual behaviors diverge
3. Provide a corrected implementation
4. Recommend best practices for this type of async operation
```

## API Integration Debugging Template

```
I'm having trouble with an API integration in my [language/framework] application.

API details:
- API provider: [name of service]
- Endpoint: [endpoint URL or name]
- Authentication method: [auth type]
- Expected response format: [format]

My implementation:
```[language]
[paste code making the API request]
```

Error response or issue:
```
[paste error response or describe unexpected behavior]
```

Request details:
- Headers: [relevant headers]
- Body: [request body if applicable]
- Method: [HTTP method]

What works:
- [successful aspects of the integration if any]

What I've verified:
- [authentication checks]
- [API documentation consistency]
- [rate limiting considerations]
- [network connectivity]

Please help me:
1. Identify what's wrong with my API request
2. Provide a corrected implementation
3. Suggest error handling improvements
4. Recommend testing strategies for API integrations
```

## Database Query Debugging Template

```
I'm experiencing an issue with a database query in my [language/framework/ORM] application.

Query or ORM code:
```[language]
[paste problematic query or code]
```

Database system:
- Type: [MySQL, PostgreSQL, MongoDB, etc.]
- Version: [database version]
- ORM/Library: [if applicable]

Error message or issue:
```
[paste error message or describe performance/results issue]
```

Schema information:
```
[relevant table definitions, indexes, relationships]
```

Sample data:
```
[sample records relevant to the query]
```

Expected results:
[what the query should return]

Actual results:
[what it actually returns]

Query plan/execution statistics (if available):
```
[paste EXPLAIN output or similar]
```

Please help me:
1. Identify issues with my query
2. Provide an optimized version
3. Explain any relevant database concepts
4. Suggest indexing or schema improvements if applicable
```

## Frontend UI/UX Bug Template

```
I'm debugging a UI/UX issue in my [framework] frontend application.

Issue description:
[detailed description of what's happening]

Relevant code:
```[language]
[component code with the issue]
```

Visual evidence:
[description of the visual problem or link to screenshot]

Expected UI behavior:
[what should happen]

Environment:
- Browser: [browser and version]
- Device/OS: [device details]
- Screen size/resolution: [if relevant]
- Framework: [React, Vue, etc. with version]

DOM/state inspection results:
```
[relevant DOM structure or state dumps]
```

Reproduction steps:
1. [step 1]
2. [step 2]
3. [etc.]

Please help me:
1. Identify the cause of this UI issue
2. Provide a solution with code
3. Explain any relevant rendering or layout concepts
4. Suggest best practices to prevent similar issues
```

## State Management Debugging Template

```
I'm having an issue with state management in my [framework] application.

State management system:
- [Redux, Context API, Vuex, etc.]

Issue description:
[detailed description of state-related problem]

Relevant code:
```[language]
[state management code with issue]
```

Component using the state:
```[language]
[component code]
```

Current state (if available):
```json
[state dump]
```

Expected state changes:
[what should happen to the state]

Actual state behavior:
[what actually happens]

Debugging attempts:
- [state monitoring tools used]
- [logging results]
- [attempted fixes]

Please help me:
1. Analyze the state flow in my application
2. Identify where state is not being properly managed
3. Provide a solution with correct state handling
4. Recommend state management patterns for this scenario
```

## CSS/Styling Debug Template

```
I'm having a styling issue with my [framework] application.

Visual issue:
[description of the styling problem]

HTML structure:
```html
[relevant HTML]
```

CSS/styles:
```css
[relevant CSS or styling code]
```

Expected appearance:
[what it should look like]

Actual appearance:
[what it actually looks like]

Browser information:
- [browser and version]
- [screen size/device if relevant]
- [zoom level if relevant]

CSS frameworks/libraries:
- [any CSS frameworks in use]

DevTools findings:
- [computed styles]
- [box model information]
- [any overrides or conflicts]

Please help me:
1. Identify the cause of this styling issue
2. Explain relevant CSS concepts (box model, specificity, etc.)
3. Provide a solution with the correct styling
4. Suggest best practices or alternative approaches
```

## Build/Compilation Error Template

```
I'm encountering a build/compilation error in my [language/framework] project.

Build tool:
- [webpack, babel, tsc, etc. with version]

Error output:
```
[paste complete build error]
```

Relevant configuration:
```
[paste build config files or settings]
```

Problematic code:
```[language]
[code causing the build issue]
```

Project structure:
[brief description of relevant project organization]

Dependencies:
- [relevant package.json extract or dependencies list]

Recent changes:
- [what changed before the build started failing]

Please help me:
1. Identify the root cause of this build error
2. Provide a solution to fix the build
3. Explain any relevant build concepts
4. Suggest improvements to my build configuration
```

## Testing Failure Template

```
I have failing tests in my [language/framework] project.

Testing framework:
- [Jest, Mocha, pytest, etc.]

Failing test(s):
```[language]
[paste failing test code]
```

Test output:
```
[paste test failure output]
```

Code being tested:
```[language]
[paste implementation being tested]
```

Expected test behavior:
[what should pass]

Environment:
- [test runner version]
- [relevant configuration]
- [CI environment details if applicable]

What changed:
- [recent code changes that might affect tests]

Please help me:
1. Analyze why these tests are failing
2. Identify whether the issue is in the tests or the implementation
3. Provide a solution to make the tests pass
4. Suggest testing best practices relevant to this case
```

## Security Vulnerability Template

```
I've identified a potential security issue in my [language/framework] application.

Vulnerability description:
[description of the security concern]

Vulnerable code:
```[language]
[paste code with potential vulnerability]
```

Security context:
- [authentication/authorization system in use]
- [data sensitivity]
- [exposure (internal/external)]
- [relevant security headers or configurations]

Type of vulnerability suspected:
- [XSS, CSRF, SQL Injection, etc.]

Reproduction scenario:
[how the vulnerability could be exploited]

Risk assessment:
- Impact: [potential damage if exploited]
- Likelihood: [how easily it could be discovered/exploited]

Please help me:
1. Assess if this is indeed a security vulnerability
2. Explain the security implications
3. Provide a secure implementation
4. Recommend additional security measures
```

## Environment/Configuration Debugging Template

```
I'm experiencing an issue that appears to be related to my [development/production] environment configuration.

Environment details:
- OS: [operating system]
- Runtime: [Node.js, Python, etc. with version]
- Framework: [framework with version]
- Deployment: [local, Docker, cloud service, etc.]

Issue symptoms:
[detailed description of the problem]

Configuration files:
```
[paste relevant configuration files]
```

Environment variables (sanitized if necessary):
```
[relevant environment variables]
```

Error messages:
```
[any error output]
```

Works in this environment:
[details of where it works, if applicable]

Fails in this environment:
[details of where it fails]

What I've verified:
- [configuration checks performed]
- [permission checks]
- [network/firewall considerations]

Please help me:
1. Identify potential environment/configuration issues
2. Suggest troubleshooting steps
3. Provide a solution to align environments
4. Recommend configuration management best practices
```

---

## Tips for Effective Debugging with AI

1. **Be exhaustive with error messages**: Always include the complete, unedited error message or stack trace
2. **Show context**: Include code before and after the problematic section
3. **Describe both expected and actual behavior**: Be clear about what should happen vs. what is happening
4. **List what you've tried**: This prevents suggestion of steps you've already taken
5. **Include environment details**: Version numbers and environment specifics are crucial
6. **Use reproducible examples**: If possible, simplify to a minimal reproducible example
7. **Include timestamps for intermittent issues**: Note when issues occur if they're not consistent
8. **Prioritize information**: Put the most critical details (error messages, problematic code) near the top of your prompt
9. **Be specific about your expertise level**: This helps tailor explanations to your understanding
10. **Follow up with clarification**: If the initial response doesn't solve the issue, provide feedback on what worked/didn't work
