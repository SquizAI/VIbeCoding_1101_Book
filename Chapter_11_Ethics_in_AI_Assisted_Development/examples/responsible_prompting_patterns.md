# Responsible Prompting Patterns for Ethical AI-Assisted Development

## Overview

How you prompt an AI coding assistant significantly influences the ethical implications of the generated code. This guide provides practical patterns for crafting prompts that encourage ethical code generation across key ethical dimensions.

## Core Principles

Responsible prompting is built on five core principles:

1. **Explicit Ethical Requirements**: Include ethical considerations directly in prompts
2. **Informed Specificity**: Be specific about requirements while seeking informed alternatives
3. **Contextual Awareness**: Provide relevant context, especially for ethical implications
4. **Collaborative Intelligence**: Treat the AI as a collaborator, not just a code generator
5. **Verification Orientation**: Design prompts that facilitate verification and understanding

## Fairness-Enhancing Prompting Patterns

### Pattern: Diverse Use Case Specification

**Structure:**
```
Generate [component] that works effectively for diverse users including [specific diverse profiles].
Ensure the solution accommodates [specific diverse scenarios].
```

**Example:**
```
Generate a user registration form that works effectively for diverse users including 
international users with different naming conventions, users with disabilities,
and users with various gender identities. Ensure the solution accommodates
users with low bandwidth connections, screen readers, and different cultural expectations.
```

### Pattern: Bias Awareness Check

**Structure:**
```
Generate [component] for [purpose].
Before finalizing, identify any potential biases this approach might introduce
and suggest modifications to mitigate them.
```

**Example:**
```
Generate a job candidate scoring algorithm based on resume data.
Before finalizing, identify any potential biases this approach might introduce
and suggest modifications to mitigate them.
```

### Pattern: Inclusive Default Enhancement

**Structure:**
```
Generate [component] with inclusive defaults that don't disadvantage any user groups.
Specifically consider [dimensions of diversity] and avoid assumptions about [potential assumptions].
```

**Example:**
```
Generate a user profile settings component with inclusive defaults that don't disadvantage any user groups.
Specifically consider language, location, accessibility needs, and device capabilities,
and avoid assumptions about technical proficiency, constant internet connectivity, or default preferences.
```

## Transparency-Enhancing Prompting Patterns

### Pattern: Explainability Request

**Structure:**
```
Generate [component] for [purpose].
Include comments that explain the reasoning behind key design decisions
and how each significant section works.
```

**Example:**
```
Generate a data validation module for financial transaction processing.
Include comments that explain the reasoning behind key design decisions
and how each significant section works.
```

### Pattern: Complexity Layering

**Structure:**
```
Generate [component] with two layers of implementation:
1. A straightforward implementation that prioritizes clarity and explainability
2. Optimizations that enhance [performance aspects] while maintaining explainability

Clearly separate and document these layers.
```

**Example:**
```
Generate a search algorithm with two layers of implementation:
1. A straightforward implementation that prioritizes clarity and explainability
2. Optimizations that enhance performance and accuracy while maintaining explainability

Clearly separate and document these layers.
```

### Pattern: Documentation-First Design

**Structure:**
```
First, generate comprehensive documentation for [component] including:
- Purpose and user-facing behavior
- Key algorithms and their explanation
- Data flows and processing logic
- Edge cases and how they're handled

Then, generate the implementation that fulfills this documentation.
```

**Example:**
```
First, generate comprehensive documentation for an authentication system including:
- Purpose and user-facing behavior
- Key algorithms and their explanation
- Data flows and processing logic
- Edge cases and how they're handled

Then, generate the implementation that fulfills this documentation.
```

## Agency-Preserving Prompting Patterns

### Pattern: Educational Explanation

**Structure:**
```
Generate [component] for [purpose].
Along with the code, provide an educational explanation that would help
a junior developer understand the key concepts and techniques used.
```

**Example:**
```
Generate a caching mechanism for database queries.
Along with the code, provide an educational explanation that would help
a junior developer understand the key concepts and techniques used.
```

### Pattern: Alternative Exploration

**Structure:**
```
Generate [number] different approaches to implementing [component],
highlighting the tradeoffs between them in terms of:
- Complexity vs. performance
- Flexibility vs. specialization
- Maintenance requirements
- Learning curve

After presenting the alternatives, recommend which might be most appropriate for [context].
```

**Example:**
```
Generate 3 different approaches to implementing a task scheduling system,
highlighting the tradeoffs between them in terms of:
- Complexity vs. performance
- Flexibility vs. specialization
- Maintenance requirements
- Learning curve

After presenting the alternatives, recommend which might be most appropriate for a medium-sized e-commerce application.
```

### Pattern: Guided Implementation

**Structure:**
```
I want to implement [component] myself but would like guidance.
Provide:
1. A high-level design approach
2. Key considerations and potential pitfalls
3. Pseudocode for critical sections
4. References to relevant patterns or concepts I should understand

Do not generate the complete implementation.
```

**Example:**
```
I want to implement a recommendation engine myself but would like guidance.
Provide:
1. A high-level design approach
2. Key considerations and potential pitfalls
3. Pseudocode for critical sections
4. References to relevant patterns or concepts I should understand

Do not generate the complete implementation.
```

## Privacy-Respecting Prompting Patterns

### Pattern: Privacy by Design

**Structure:**
```
Generate [component] following privacy-by-design principles.
Specifically:
- Minimize data collection to only what's essential
- Include appropriate anonymization or pseudonymization
- Implement proper data lifecycle management
- Ensure user consent mechanisms
```

**Example:**
```
Generate a user analytics module following privacy-by-design principles.
Specifically:
- Minimize data collection to only what's essential
- Include appropriate anonymization or pseudonymization
- Implement proper data lifecycle management
- Ensure user consent mechanisms
```

### Pattern: Privacy Impact Consideration

**Structure:**
```
Generate [component] for [purpose].
Before providing the final solution, analyze potential privacy implications
and modify the design to address them.
```

**Example:**
```
Generate a user location tracking feature for a fitness app.
Before providing the final solution, analyze potential privacy implications
and modify the design to address them.
```

### Pattern: Regulatory Compliance

**Structure:**
```
Generate [component] that complies with [specific regulations].
Highlight aspects of the implementation that specifically address regulatory requirements.
```

**Example:**
```
Generate a data export function that complies with GDPR and CCPA requirements.
Highlight aspects of the implementation that specifically address regulatory requirements.
```

## Verification-Oriented Prompting Patterns

### Pattern: Test-First Generation

**Structure:**
```
Before generating the implementation of [component], first generate:
1. A comprehensive test suite that verifies correct functionality
2. Test cases for edge cases and potential failure modes
3. Tests for performance characteristics

Then generate an implementation that passes these tests.
```

**Example:**
```
Before generating the implementation of a payment processing module, first generate:
1. A comprehensive test suite that verifies correct functionality
2. Test cases for edge cases and potential failure modes
3. Tests for performance characteristics

Then generate an implementation that passes these tests.
```

### Pattern: Self-Review Request

**Structure:**
```
Generate [component] for [purpose].
After generating the implementation, conduct a thorough code review
identifying potential issues with:
- Security vulnerabilities
- Performance bottlenecks
- Maintenance concerns
- Edge case handling
```

**Example:**
```
Generate an API authentication middleware for a Node.js application.
After generating the implementation, conduct a thorough code review
identifying potential issues with:
- Security vulnerabilities
- Performance bottlenecks
- Maintenance concerns
- Edge case handling
```

### Pattern: Verification Checklist

**Structure:**
```
Generate [component] along with a verification checklist that allows me to
validate that the implementation:
- Meets functional requirements
- Handles edge cases appropriately
- Follows best practices for security
- Performs efficiently
- Is maintainable and extensible
```

**Example:**
```
Generate a database migration system along with a verification checklist that allows me to
validate that the implementation:
- Meets functional requirements
- Handles edge cases appropriately
- Follows best practices for security
- Performs efficiently
- Is maintainable and extensible
```

## Contextual Integration Patterns

### Pattern: Ethical Integration Request

**Structure:**
```
I'm developing [broader system] which has these ethical considerations:
- [ethical consideration 1]
- [ethical consideration 2]
- [ethical consideration 3]

Generate [specific component] that specifically addresses these considerations while delivering [functional requirements].
```

**Example:**
```
I'm developing a hiring automation system which has these ethical considerations:
- Must avoid bias against protected characteristics
- Should provide transparent explanations for decisions
- Needs to keep personal candidate data private and secure

Generate a resume parsing component that specifically addresses these considerations while delivering accurate skill and experience extraction.
```

### Pattern: Stakeholder-Aware Development

**Structure:**
```
Generate [component] with awareness of these stakeholder needs:
- [stakeholder 1]: [specific needs/concerns]
- [stakeholder 2]: [specific needs/concerns] 
- [stakeholder 3]: [specific needs/concerns]

Ensure the solution balances these potentially competing concerns.
```

**Example:**
```
Generate a content moderation system with awareness of these stakeholder needs:
- Content creators: Need fair treatment and clear explanation of moderation decisions
- Platform users: Need protection from harmful content while maintaining free expression
- Moderators: Need efficient tools that support consistent decision-making
- Legal compliance: Need auditable processes that meet regulatory requirements

Ensure the solution balances these potentially competing concerns.
```

### Pattern: Ethical Requirement Prioritization

**Structure:**
```
Generate [component] that must meet these requirements in priority order:
1. [ethical requirement 1]
2. [ethical requirement 2]
3. [functional requirement 1]
4. [functional requirement 2]

If trade-offs are necessary, maintain the priority ordering.
```

**Example:**
```
Generate a data analytics dashboard that must meet these requirements in priority order:
1. Protect user privacy by avoiding individual user identification
2. Provide transparent explanation of how metrics are calculated
3. Display real-time conversion metrics across user segments
4. Allow drill-down analysis of performance patterns

If trade-offs are necessary, maintain the priority ordering.
```

## Practical Application

When approaching an AI-assisted development task:

1. **Identify ethical dimensions**: Determine which ethical considerations are most relevant
2. **Select appropriate patterns**: Choose prompting patterns that address these dimensions
3. **Combine patterns as needed**: Many prompts will use multiple patterns
4. **Iterate based on responses**: Refine prompts based on the quality of generated content
5. **Document your approach**: Record effective prompting patterns for future use

## Example: Comprehensive Ethical Prompt

```
I need to develop a user profiling system for product recommendations with these requirements:

Ethical Requirements (prioritized):
- Must protect user privacy and comply with GDPR
- Should be transparent about how recommendations are generated
- Must avoid bias based on demographic characteristics
- Should preserve user agency through clear controls

Functional Requirements:
- Capture user preferences based on browsing and purchase history
- Generate relevant product recommendations
- Support personalization of the shopping experience
- Work efficiently with our PostgreSQL database

Please provide:
1. Three alternative approaches with their ethical trade-offs
2. A recommended implementation with comprehensive documentation
3. A verification checklist for ethical compliance
4. Clear explanations of algorithms used
5. Privacy-enhancing techniques incorporated into the design

Also highlight any potential ethical issues I should be aware of that I haven't explicitly mentioned.
```

## Conclusion

Responsible prompting is a skill that develops with practice. By intentionally incorporating ethical considerations into your prompts, you can guide AI coding assistants toward generating more ethically sound code and preserve your agency as a developer.
