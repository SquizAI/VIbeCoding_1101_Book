# Beginner Exercise 4: Responsible Prompting Practice

## Overview

How you prompt an AI coding assistant significantly influences the ethical quality of the generated code. This exercise helps you develop skills in crafting prompts that encourage more ethical, transparent, and responsible code generation.

## Objectives

- Understand how prompting affects ethical dimensions of generated code
- Practice crafting prompts that enhance fairness, transparency, and accountability
- Develop the ability to identify and avoid problematic prompting patterns
- Create a personal library of ethically-oriented prompting templates

## Exercise

### Part 1: Understanding Prompting Impact

Before practicing prompt crafting, it's important to understand how prompts affect the ethical dimensions of generated code:

**Prompt Elements with Ethical Impact:**
1. **Specificity level**: How detailed your requirements are
2. **Value language**: What you emphasize as important
3. **Contextual information**: What background you provide
4. **Constraint definition**: What boundaries you establish
5. **Verification requests**: What checks you ask for

**Ethical Dimensions Affected by Prompts:**
1. **Fairness**: Whether the code treats different users equitably
2. **Transparency**: How understandable and explainable the code is
3. **Privacy**: How the code handles sensitive information
4. **Agency**: How much control and understanding you maintain
5. **Accessibility**: Whether the code is usable by diverse users

### Part 2: Prompt Analysis

Analyze the following prompts for their potential ethical implications:

**Prompt A:**
```
Generate a user registration form that collects necessary information and validates inputs.
```

**Prompt B:**
```
Generate a user registration form with these specifications:
- Collect email, name, password, and date of birth
- Validate email format and password strength
- Ensure the form works on mobile devices
```

**Prompt C:**
```
Generate a user registration form that:
- Collects only essential information (email, display name, password)
- Validates inputs while providing clear error messages
- Works for users with various accessibility needs
- Protects user privacy by minimizing data collection
- Includes explanatory comments for all validation logic

Also explain your design decisions and any assumptions you made.
```

For each prompt, consider:
- How likely is the generated code to be fair and inclusive?
- How transparent will the resulting code be?
- How will privacy considerations be handled?
- How much agency will you maintain as a developer?
- What ethical aspects might be overlooked?

### Part 3: Prompt Transformation Practice

Take the following basic prompts and transform them into ethically-oriented prompts:

**Basic Prompt 1:** 
```
Create a function that sorts a list of job candidates based on their qualifications.
```

**Basic Prompt 2:**
```
Generate code for a recommendation algorithm that suggests products to users.
```

**Basic Prompt 3:**
```
Write a data analytics dashboard that displays user behavior metrics.
```

For each transformation:
1. Identify potential ethical concerns in the basic prompt
2. Add specific requirements to address fairness
3. Include elements that enhance transparency
4. Incorporate privacy considerations
5. Add requests that support your agency and understanding
6. Request that the AI explain its approach and decisions

### Part 4: Scenario-Based Prompting

For each of the following scenarios, craft a comprehensive, ethically-oriented prompt:

**Scenario 1: Content Moderation**  
You need to create a system that moderates user-generated content for a community platform. The system should filter inappropriate content while respecting free expression.

**Scenario 2: Personal Finance Application**  
You're developing a feature that categorizes transactions and recommends budget adjustments for a personal finance application.

**Scenario 3: Healthcare Appointment Scheduling**  
You're creating a system that prioritizes and schedules patient appointments based on various factors.

For each scenario, your prompt should:
- Clearly address potential ethical concerns
- Include specific requirements for fairness and inclusivity
- Request transparency in the implementation
- Consider privacy and security implications
- Include elements that support your understanding and agency
- Ask for explanation of key design decisions

### Part 5: Responsible Prompting Template Creation

Create three reusable prompting templates that you can adapt for different situations:

1. **A Fairness-Focused Template** for situations where equitable treatment is particularly important

2. **A Transparency-Enhancing Template** for situations where understanding and explainability are critical

3. **A Privacy-Preserving Template** for situations involving sensitive data

Each template should include:
- Standard framing of the request
- Ethical requirements to include
- Specific questions to ask the AI
- Requests for explanations and documentation
- Placeholders for project-specific information

## Reflection Questions

After completing the exercise, reflect on the following questions:

1. How has your approach to prompting changed after completing this exercise?

2. What ethical dimensions do you find most challenging to address through prompting?

3. How might prompt engineering become part of a broader ethical AI development process?

4. What tensions do you notice between different ethical considerations when crafting prompts?

5. How might prompting strategies need to evolve as AI capabilities advance?

## Extension Activities

1. **Prompt Comparison**: Try generating code using both basic and ethically-enhanced prompts for the same task. Compare the results and document the differences.

2. **Collaborative Prompting**: Exchange prompts with colleagues and provide feedback on the ethical dimensions of each other's prompts.

3. **Prompt Library Development**: Build a comprehensive library of ethically-oriented prompts for common development tasks.

4. **Edge Case Exploration**: Experiment with how different prompting approaches handle edge cases and unexpected scenarios.

## Submission

Submit your prompt analyses, transformations, scenario-based prompts, and templates, along with brief reflections on what you learned throughout the exercise.
