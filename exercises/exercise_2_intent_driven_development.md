# Exercise 2: Intent-Driven Development Framework

## Overview

In this exercise, you'll design and implement a framework for Intent-Driven Development (IDD), a future development approach where developers focus on specifying intentions and desired outcomes rather than implementation details. You'll create a simplified version of an intent translation system that bridges the gap between high-level intentions and functional code.

## Learning Objectives

- Explore the concept of Intent-Driven Development
- Design frameworks for translating intentions to implementations
- Practice creating clear, specific intent specifications
- Implement a simple intent-to-code translation system

## Prerequisites

- Completion of Chapter 12 Beginner section
- Understanding of current AI code generation capabilities
- Experience with software architecture design
- Familiarity with prompt engineering concepts

## The Challenge

Create a framework that demonstrates how Intent-Driven Development might work in practice. Your system should:

1. Define a structured format for expressing development intentions
2. Provide a mechanism for clarifying and refining intentions
3. Translate refined intentions into implementation plans
4. Generate working code from the implementation plans
5. Include a feedback mechanism for validating the results against original intentions

## Step 1: Design Your Intent Specification Format

Create a structured format for expressing development intentions that is both human-friendly and machine-processable. Your format should:

- Capture the essential "what" and "why" without prescribing the "how"
- Include functional requirements and constraints
- Specify quality attributes and acceptance criteria
- Provide context necessary for appropriate implementation

Example intent specification structure:

```javascript
const intentSpecification = {
  // Core intent - what needs to be accomplished
  intent: "Create a data visualization component that displays time-series data",
  
  // Functional requirements
  functionalRequirements: [
    "Display time-series data as a line chart",
    "Support zooming and panning",
    "Allow toggling visibility of different data series",
    "Show data point details on hover"
  ],
  
  // Constraints that must be respected
  constraints: [
    "Must work in modern browsers (Chrome, Firefox, Safari)",
    "Must be responsive down to 320px width",
    "Must be accessible according to WCAG 2.1 AA standards",
    "Must work without network connectivity after initial load"
  ],
  
  // Quality attributes
  qualityAttributes: {
    performance: "Should render 10,000 data points in under 500ms",
    usability: "Users should be able to find and use all features without training",
    maintainability: "Code should be modular and well-documented"
  },
  
  // Usage context
  context: {
    userExpertise: "Non-technical business analysts",
    integrationEnvironment: "React-based dashboard application",
    dataCharacteristics: "Time-stamped measurements with up to 5 different metrics"
  },
  
  // Acceptance criteria
  acceptanceCriteria: [
    "Analysts can view trends over custom time ranges",
    "Chart remains responsive with 1 year of hourly data",
    "Screen readers can access the data in a meaningful way",
    "Visual design matches the existing application style"
  ]
};
```

Design your own intent specification format, focusing on making it comprehensive yet usable.

## Step 2: Create an Intent Refinement System

Develop a system that identifies areas where an intent specification needs clarification or additional detail. Your system should:

1. Analyze an intent specification for vagueness, ambiguity, or missing information
2. Generate targeted questions to refine the intent
3. Incorporate answers into an improved specification

Example implementation approach:

```javascript
class IntentRefinementSystem {
  constructor() {
    this.refinementPatterns = [
      {
        aspect: "functionalRequirements",
        detectionPattern: /display|show|visualize/i,
        refinementQuestions: [
          "What specific type of visualization is needed?",
          "What interactions should be supported?",
          "What data properties need to be visible?"
        ]
      },
      {
        aspect: "constraints",
        detectionPattern: /responsive|mobile/i,
        refinementQuestions: [
          "What is the minimum viewport size that must be supported?",
          "Should mobile-specific interactions (touch gestures) be supported?",
          "Are there network constraints to consider for mobile users?"
        ]
      },
      // Additional patterns for other aspects
    ];
  }
  
  analyzeIntent(intentSpecification) {
    const refinementNeeds = [];
    
    // Analyze each aspect of the intent specification
    for (const aspect in intentSpecification) {
      const aspectValue = intentSpecification[aspect];
      
      // Check for vagueness or missing information
      if (this.isVague(aspect, aspectValue)) {
        refinementNeeds.push({
          aspect,
          issue: "vagueness",
          questions: this.generateQuestionsForVagueness(aspect, aspectValue)
        });
      }
      
      // Check for internal contradictions
      if (this.hasContradictions(aspect, aspectValue)) {
        refinementNeeds.push({
          aspect,
          issue: "contradiction",
          questions: this.generateQuestionsForContradiction(aspect, aspectValue)
        });
      }
      
      // Check for missing key information
      if (this.hasMissingInformation(aspect, aspectValue)) {
        refinementNeeds.push({
          aspect,
          issue: "missingInformation",
          questions: this.generateQuestionsForMissingInfo(aspect, aspectValue)
        });
      }
    }
    
    return refinementNeeds;
  }
  
  // Implement the detection methods
  isVague(aspect, value) {
    // Implementation logic
  }
  
  hasContradictions(aspect, value) {
    // Implementation logic
  }
  
  hasMissingInformation(aspect, value) {
    // Implementation logic
  }
  
  // Implement the question generation methods
  generateQuestionsForVagueness(aspect, value) {
    // Implementation logic
  }
  
  generateQuestionsForContradiction(aspect, value) {
    // Implementation logic
  }
  
  generateQuestionsForMissingInfo(aspect, value) {
    // Implementation logic
  }
  
  // Method to incorporate answers and refine the intent
  refineIntent(intentSpecification, refinementNeeds, answers) {
    const refinedIntent = { ...intentSpecification };
    
    // Process each answer and update the corresponding aspect
    // of the intent specification
    
    return refinedIntent;
  }
}
```

Implement a simplified version of this refinement system.

## Step 3: Develop an Implementation Planning System

Create a system that translates a refined intent into an implementation plan. Your system should:

1. Break down the intent into logical components or modules
2. Identify appropriate technologies and approaches for each component
3. Define interfaces and integration points
4. Establish an implementation sequence

Example implementation plan structure:

```javascript
const implementationPlan = {
  components: [
    {
      name: "TimeSeriesChart",
      responsibility: "Core visualization component",
      technology: "D3.js",
      interfaces: {
        inputs: [
          { name: "data", type: "Array<{timestamp: Date, values: Array<number>}>" },
          { name: "config", type: "ChartConfiguration" }
        ],
        outputs: [
          { name: "selectionChange", type: "Event<{startTime: Date, endTime: Date}>" },
          { name: "hoverPoint", type: "Event<{timestamp: Date, values: Array<number>, index: number}>" }
        ]
      },
      qualityConsiderations: [
        "Implement virtual rendering for large datasets",
        "Use requestAnimationFrame for smooth animations",
        "Add keyboard navigation for accessibility"
      ]
    },
    // Additional components...
  ],
  
  integrationStrategy: {
    compositionPattern: "Container/Presentational",
    stateManagement: "React Context for chart configuration",
    eventHandling: "Custom event bus for cross-component communication"
  },
  
  implementationSequence: [
    "1. Core data rendering with basic axes",
    "2. Zoom and pan interactions",
    "3. Series toggling and hover interactions",
    "4. Accessibility features",
    "5. Performance optimizations",
    "6. Responsive design adjustments"
  ],
  
  testingStrategy: {
    unitTests: [
      "Data transformation functions",
      "Rendering logic",
      "Event handling"
    ],
    integrationTests: [
      "Component composition",
      "State management",
      "Event propagation"
    ],
    acceptanceTests: [
      "End-to-end workflows matching acceptance criteria"
    ]
  }
};
```

Design and implement your own approach to generating implementation plans from refined intents.

## Step 4: Create a Code Generation System

Develop a simple system that can generate skeleton code based on an implementation plan. Your system should:

1. Create appropriate file and folder structures
2. Generate component scaffolding
3. Implement core functionality based on the implementation plan
4. Include comments explaining design decisions and TODO items

At a minimum, your system should be able to generate:

- Component/class definitions
- Interface declarations
- Basic implementation of core functionality
- Test file skeletons

Example code generation approach:

```javascript
class CodeGenerationSystem {
  constructor() {
    this.templates = {
      reactComponent: (componentName, props, description) => `
/**
 * ${description}
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/${componentName}.css';

const ${componentName} = ({ ${Object.keys(props).join(', ')} }) => {
  // State initialization
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // Implementation
  }, [${Object.keys(props).join(', ')}]);
  
  // Event handlers
  
  // Rendering
  return (
    <div className="${componentName.toLowerCase()}-container">
      {/* Implementation */}
    </div>
  );
};

${componentName}.propTypes = {
${Object.entries(props).map(([name, type]) => `  ${name}: PropTypes.${type},`).join('\n')}
};

export default ${componentName};
      `,
      
      // Additional templates for other types of files
    };
  }
  
  generateCode(implementationPlan) {
    const codeArtifacts = {};
    
    // Generate code for each component
    for (const component of implementationPlan.components) {
      codeArtifacts[`${component.name}.js`] = this.generateComponentCode(component);
      codeArtifacts[`${component.name}.test.js`] = this.generateTestCode(component);
      codeArtifacts[`styles/${component.name}.css`] = this.generateStylesCode(component);
    }
    
    // Generate integration code
    codeArtifacts['index.js'] = this.generateIndexCode(implementationPlan);
    
    // Generate README or documentation
    codeArtifacts['README.md'] = this.generateDocumentation(implementationPlan);
    
    return codeArtifacts;
  }
  
  // Implement the specific generation methods
  generateComponentCode(component) {
    // Implementation logic using templates
  }
  
  generateTestCode(component) {
    // Implementation logic using templates
  }
  
  generateStylesCode(component) {
    // Implementation logic using templates
  }
  
  generateIndexCode(implementationPlan) {
    // Implementation logic using templates
  }
  
  generateDocumentation(implementationPlan) {
    // Implementation logic using templates
  }
}
```

Implement a simplified version of this code generation system.

## Step 5: Design a Validation Framework

Create a framework for validating that the generated code fulfills the original intent. Your framework should:

1. Map acceptance criteria to testable conditions
2. Generate validation tests based on the acceptance criteria
3. Provide feedback on how well the implementation satisfies the intent
4. Identify areas for improvement

Example validation approach:

```javascript
class IntentValidationFramework {
  constructor() {
    this.validationStrategies = {
      functionality: this.validateFunctionality,
      performance: this.validatePerformance,
      accessibility: this.validateAccessibility,
      usability: this.validateUsability
    };
  }
  
  async validateImplementation(intentSpecification, codeArtifacts) {
    const validationResults = {
      criteria: [],
      overallFulfillment: 0,
      improvementAreas: []
    };
    
    // Validate each acceptance criterion
    for (const criterion of intentSpecification.acceptanceCriteria) {
      const criterionResult = await this.validateCriterion(criterion, intentSpecification, codeArtifacts);
      validationResults.criteria.push(criterionResult);
    }
    
    // Validate quality attributes
    for (const [quality, expectation] of Object.entries(intentSpecification.qualityAttributes)) {
      const qualityResult = await this.validateQualityAttribute(quality, expectation, codeArtifacts);
      validationResults.criteria.push(qualityResult);
    }
    
    // Calculate overall fulfillment score
    validationResults.overallFulfillment = this.calculateFulfillmentScore(validationResults.criteria);
    
    // Identify improvement areas
    validationResults.improvementAreas = this.identifyImprovementAreas(validationResults.criteria);
    
    return validationResults;
  }
  
  async validateCriterion(criterion, intentSpecification, codeArtifacts) {
    // Analyze criterion to determine validation strategy
    const validationStrategy = this.determineValidationStrategy(criterion);
    
    // Apply the appropriate validation strategy
    return this.validationStrategies[validationStrategy](criterion, intentSpecification, codeArtifacts);
  }
  
  determineValidationStrategy(criterion) {
    // Logic to determine which validation strategy applies
    if (criterion.toLowerCase().includes('responsive') || criterion.toLowerCase().includes('view')) {
      return 'functionality';
    } else if (criterion.toLowerCase().includes('performance') || criterion.toLowerCase().includes('responsive')) {
      return 'performance';
    } else if (criterion.toLowerCase().includes('accessibility') || criterion.toLowerCase().includes('screen reader')) {
      return 'accessibility';
    } else if (criterion.toLowerCase().includes('user') || criterion.toLowerCase().includes('experience')) {
      return 'usability';
    } else {
      return 'functionality'; // Default strategy
    }
  }
  
  // Implement specific validation strategies
  async validateFunctionality(criterion, intentSpecification, codeArtifacts) {
    // Implementation logic
  }
  
  async validatePerformance(criterion, intentSpecification, codeArtifacts) {
    // Implementation logic
  }
  
  async validateAccessibility(criterion, intentSpecification, codeArtifacts) {
    // Implementation logic
  }
  
  async validateUsability(criterion, intentSpecification, codeArtifacts) {
    // Implementation logic
  }
  
  // Helper methods
  calculateFulfillmentScore(criteria) {
    // Implementation logic
  }
  
  identifyImprovementAreas(criteria) {
    // Implementation logic
  }
}
```

Design and implement a simplified version of this validation framework.

## Deliverables

1. A complete Intent-Driven Development framework including:
   - Intent specification format definition
   - Intent refinement system
   - Implementation planning system
   - Code generation system
   - Validation framework

2. A demonstration example showing:
   - An initial intent specification
   - The refinement process
   - The resulting implementation plan
   - Generated code artifacts
   - Validation results

3. Documentation explaining:
   - The philosophy and approach of your IDD framework
   - How each component works and interacts with others
   - How the framework could be extended or improved
   - The potential impact on developer workflow and productivity

## Evaluation Criteria

Your Intent-Driven Development framework will be evaluated based on:

1. **Comprehensiveness**: Does it address all aspects of the development workflow?
2. **Usability**: Is the intent specification format intuitive and expressive?
3. **Intelligence**: Does the refinement system identify important clarification needs?
4. **Quality**: Does the code generation produce well-structured, maintainable code?
5. **Validation**: Does the validation framework provide meaningful feedback?

## Bonus Challenges

1. **Interactive Refinement**: Create an interactive system that simulates a dialogue for intent refinement
2. **Multiple Implementation Options**: Generate alternative implementation plans and allow selection between them
3. **Learning System**: Design a mechanism for the framework to improve based on feedback about its outputs

## Resources

- [The Intent-Driven Architecture Revolution](https://example.com/intent-driven-architecture) (fictional resource)
- [Design by Contract Programming](https://en.wikipedia.org/wiki/Design_by_contract)
- [Behavior-Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development)
- [Code Generation Best Practices](https://example.com/code-generation-practices) (fictional resource)
