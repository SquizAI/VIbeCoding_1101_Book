# Exercise 2: Bias Detection and Mitigation in AI-Generated Code

## Overview

In this exercise, you will develop a practical system for detecting and mitigating bias in AI-generated code. You'll learn how to identify different types of bias that can emerge in AI-assisted development and implement strategies to address them.

## Learning Objectives

- Identify common patterns of bias in AI-generated code
- Develop detection mechanisms for various bias types
- Implement practical mitigation strategies
- Create a reusable framework for ongoing bias monitoring

## Prerequisites

- Completion of Chapter 11 Beginner section
- Basic understanding of AI code generation tools
- Intermediate JavaScript skills

## The Challenge

You're working with an AI-assisted development platform that generates code based on developer prompts. Your team has noticed that the AI sometimes produces code with various biases, including:

1. **Representation bias** - Using non-inclusive variable names or examples
2. **Functional bias** - Generating solutions that work better for certain regions or languages
3. **Performance bias** - Creating optimizations that favor certain hardware or browsers
4. **Accessibility bias** - Overlooking accessibility considerations in UI code

Your task is to build a bias detection and mitigation system that can be integrated into your development workflow.

## Step 1: Create a Bias Classification System

First, develop a system to classify different types of bias:

```javascript
// BiasDetectionSystem.js
class BiasDetectionSystem {
  constructor() {
    this.biasTypes = {
      representation: {
        description: "Bias in naming conventions, examples, or documentation",
        detectors: []
      },
      functional: {
        description: "Bias in functionality that privileges certain contexts",
        detectors: []
      },
      performance: {
        description: "Bias in optimizations or performance considerations",
        detectors: []
      },
      accessibility: {
        description: "Bias related to accessibility considerations",
        detectors: []
      },
      // Add other bias types as needed
    };
  }
  
  registerDetector(biasType, detector) {
    if (!this.biasTypes[biasType]) {
      throw new Error(`Unknown bias type: ${biasType}`);
    }
    
    this.biasTypes[biasType].detectors.push(detector);
    return this; // For method chaining
  }
  
  async detectBias(code, context = {}) {
    const results = {
      biasDetected: false,
      detailedResults: {}
    };
    
    // Run all detectors for each bias type
    for (const [biasType, config] of Object.entries(this.biasTypes)) {
      results.detailedResults[biasType] = {
        biasDetected: false,
        instances: []
      };
      
      for (const detector of config.detectors) {
        const detectionResult = await detector.detect(code, context);
        
        if (detectionResult.biasDetected) {
          results.biasDetected = true;
          results.detailedResults[biasType].biasDetected = true;
          results.detailedResults[biasType].instances.push(...detectionResult.instances);
        }
      }
    }
    
    return results;
  }
  
  generateReport(detectionResults) {
    // Implement detailed reporting logic
    // ...
  }
}

// Example usage
const biasDetector = new BiasDetectionSystem();
```

## Step 2: Implement Detectors for Each Bias Type

Create specific detectors for each bias type:

```javascript
// RepresentationBiasDetector.js
class RepresentationBiasDetector {
  constructor() {
    this.nonInclusiveTerms = [
      // List of potentially non-inclusive terms
      { term: "blacklist", alternatives: ["blocklist", "denylist"] },
      { term: "whitelist", alternatives: ["allowlist", "permitlist"] },
      { term: "master", alternatives: ["main", "primary", "leader"] },
      { term: "slave", alternatives: ["secondary", "replica", "follower"] },
      // Add more terms
    ];
    
    this.genderCodeTerms = [
      // Terms with gender implications
      { term: "guys", alternatives: ["folks", "everyone", "team"] },
      // Add more terms
    ];
    
    // Add more categories as needed
  }
  
  async detect(code, context = {}) {
    const result = {
      biasDetected: false,
      instances: []
    };
    
    // Check for non-inclusive terms
    for (const { term, alternatives } of this.nonInclusiveTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(code)) !== null) {
        result.biasDetected = true;
        result.instances.push({
          type: 'nonInclusiveTerm',
          term,
          location: match.index,
          alternatives,
          context: code.substring(Math.max(0, match.index - 20), 
                                 Math.min(code.length, match.index + term.length + 20))
        });
      }
    }
    
    // Similar checks for other categories
    // ...
    
    return result;
  }
}

// Similar implementation for other detector types
// FunctionalBiasDetector.js
// PerformanceBiasDetector.js
// AccessibilityBiasDetector.js
```

## Step 3: Create Mitigation Strategies

Implement mitigation strategies for detected biases:

```javascript
// BiasMitigationSystem.js
class BiasMitigationSystem {
  constructor() {
    this.mitigationStrategies = {};
  }
  
  registerStrategy(biasType, strategy) {
    if (!this.mitigationStrategies[biasType]) {
      this.mitigationStrategies[biasType] = [];
    }
    
    this.mitigationStrategies[biasType].push(strategy);
    return this; // For method chaining
  }
  
  async mitigateBias(code, detectionResults) {
    let mitigatedCode = code;
    const mitigationActions = [];
    
    // Apply appropriate mitigation strategies for each detected bias
    for (const [biasType, result] of Object.entries(detectionResults.detailedResults)) {
      if (result.biasDetected && this.mitigationStrategies[biasType]) {
        for (const strategy of this.mitigationStrategies[biasType]) {
          const mitigation = await strategy.mitigate(mitigatedCode, result.instances);
          
          if (mitigation.codeChanged) {
            mitigatedCode = mitigation.mitigatedCode;
            mitigationActions.push(...mitigation.actions);
          }
        }
      }
    }
    
    return {
      originalCode: code,
      mitigatedCode,
      codeChanged: mitigatedCode !== code,
      mitigationActions
    };
  }
  
  generateMitigationReport(mitigationResult) {
    // Implement reporting logic
    // ...
  }
}

// Example implementation of a mitigation strategy
class RepresentationBiasMitigationStrategy {
  async mitigate(code, biasInstances) {
    let mitigatedCode = code;
    const actions = [];
    
    // Sort instances by location in reverse order to avoid position shifts
    const sortedInstances = [...biasInstances]
      .filter(instance => instance.type === 'nonInclusiveTerm')
      .sort((a, b) => b.location - a.location);
    
    for (const instance of sortedInstances) {
      // Choose the first alternative
      const replacement = instance.alternatives[0];
      
      // Replace the term in the code
      mitigatedCode = mitigatedCode.substring(0, instance.location) +
                     replacement +
                     mitigatedCode.substring(instance.location + instance.term.length);
      
      actions.push({
        type: 'termReplacement',
        originalTerm: instance.term,
        replacement,
        location: instance.location
      });
    }
    
    return {
      mitigatedCode,
      codeChanged: mitigatedCode !== code,
      actions
    };
  }
}
```

## Step 4: Build an Integration System

Create a system that integrates bias detection and mitigation into your development workflow:

```javascript
// BiasManagementSystem.js
class BiasManagementSystem {
  constructor(config = {}) {
    this.detectionSystem = new BiasDetectionSystem();
    this.mitigationSystem = new BiasMitigationSystem();
    this.config = {
      autoMitigate: config.autoMitigate || false,
      generateReports: config.generateReports || true,
      logResults: config.logResults || true
    };
    
    // Initialize with default detectors and strategies
    this.initializeDefaultDetectors();
    this.initializeDefaultStrategies();
  }
  
  initializeDefaultDetectors() {
    // Register default detectors
    this.detectionSystem.registerDetector('representation', new RepresentationBiasDetector());
    // Register other default detectors
  }
  
  initializeDefaultStrategies() {
    // Register default mitigation strategies
    this.mitigationSystem.registerStrategy('representation', new RepresentationBiasMitigationStrategy());
    // Register other default strategies
  }
  
  async processcode(code, context = {}) {
    // Step 1: Detect bias
    const detectionResults = await this.detectionSystem.detectBias(code, context);
    
    // Step 2: Generate detection report if configured
    if (this.config.generateReports) {
      const detectionReport = this.detectionSystem.generateReport(detectionResults);
      
      if (this.config.logResults) {
        console.log('Bias Detection Report:', detectionReport);
      }
    }
    
    // Step 3: Mitigate bias if configured or if bias detected
    let mitigationResults = null;
    if (this.config.autoMitigate && detectionResults.biasDetected) {
      mitigationResults = await this.mitigationSystem.mitigateBias(code, detectionResults);
      
      // Step 4: Generate mitigation report if configured
      if (this.config.generateReports) {
        const mitigationReport = this.mitigationSystem.generateMitigationReport(mitigationResults);
        
        if (this.config.logResults) {
          console.log('Bias Mitigation Report:', mitigationReport);
        }
      }
    }
    
    return {
      detectionResults,
      mitigationResults
    };
  }
}

// Example usage
const biasSystem = new BiasManagementSystem({ autoMitigate: true });
const results = await biasSystem.processcode(aiGeneratedCode, { 
  projectContext: 'e-commerce',
  targetAudience: 'global',
  accessibilityRequirements: 'WCAG 2.1'
});
```

## Step 5: Create a Continuous Improvement System

Develop a system to learn from previous bias detection and mitigation:

```javascript
// BiasContinuousImprovement.js
class BiasContinuousImprovement {
  constructor() {
    this.biasInstances = [];
    this.mitigationEffectiveness = {};
    this.feedbackLog = [];
  }
  
  recordBiasInstance(instance, mitigationApplied, feedback = null) {
    const record = {
      biasType: instance.type,
      instance,
      timestamp: new Date(),
      mitigationApplied,
      feedback
    };
    
    this.biasInstances.push(record);
    
    // Update mitigation effectiveness if feedback provided
    if (feedback) {
      this.recordFeedback(instance.type, mitigationApplied, feedback);
    }
    
    return record;
  }
  
  recordFeedback(biasType, mitigationApplied, feedback) {
    // Record feedback on mitigation effectiveness
    const feedbackRecord = {
      biasType,
      mitigationApplied,
      feedback,
      timestamp: new Date()
    };
    
    this.feedbackLog.push(feedbackRecord);
    
    // Update effectiveness metrics
    if (!this.mitigationEffectiveness[biasType]) {
      this.mitigationEffectiveness[biasType] = {};
    }
    
    if (!this.mitigationEffectiveness[biasType][mitigationApplied]) {
      this.mitigationEffectiveness[biasType][mitigationApplied] = {
        successCount: 0,
        failureCount: 0,
        totalFeedback: 0
      };
    }
    
    const metrics = this.mitigationEffectiveness[biasType][mitigationApplied];
    metrics.totalFeedback += 1;
    
    if (feedback.effective) {
      metrics.successCount += 1;
    } else {
      metrics.failureCount += 1;
    }
    
    return feedbackRecord;
  }
  
  generateImprovementSuggestions() {
    const suggestions = [];
    
    // Analyze patterns in bias instances
    const biasPatterns = this.analyzeBiasPatterns();
    
    // Generate suggestions based on patterns
    for (const [biasType, pattern] of Object.entries(biasPatterns)) {
      if (pattern.frequency > 0.1) { // More than 10% occurrence
        suggestions.push({
          biasType,
          suggestion: `High frequency of ${biasType} bias detected. Consider additional training or rules.`,
          data: pattern
        });
      }
    }
    
    // Analyze mitigation effectiveness
    for (const [biasType, strategies] of Object.entries(this.mitigationEffectiveness)) {
      for (const [strategy, metrics] of Object.entries(strategies)) {
        if (metrics.totalFeedback > 10) { // Enough feedback to draw conclusions
          const effectivenessRate = metrics.successCount / metrics.totalFeedback;
          
          if (effectivenessRate < 0.6) { // Less than 60% effective
            suggestions.push({
              biasType,
              strategy,
              suggestion: `Low effectiveness rate (${Math.round(effectivenessRate * 100)}%) for ${strategy} on ${biasType} bias. Consider revising this strategy.`,
              data: metrics
            });
          }
        }
      }
    }
    
    return suggestions;
  }
  
  analyzeBiasPatterns() {
    // Implement pattern analysis logic
    const patterns = {};
    
    // Count instances by type
    for (const record of this.biasInstances) {
      if (!patterns[record.biasType]) {
        patterns[record.biasType] = {
          count: 0,
          examples: [],
          frequency: 0
        };
      }
      
      patterns[record.biasType].count += 1;
      
      if (patterns[record.biasType].examples.length < 5) {
        patterns[record.biasType].examples.push(record.instance);
      }
    }
    
    // Calculate frequencies
    const totalInstances = this.biasInstances.length;
    for (const type in patterns) {
      patterns[type].frequency = patterns[type].count / totalInstances;
    }
    
    return patterns;
  }
}
```

## Step 6: Create a Test Suite

Develop a test suite to verify your bias detection and mitigation system:

```javascript
// BiasSystemTests.js
async function runBiasSystemTests() {
  const testCases = [
    {
      name: "Representation Bias - Non-inclusive Terms",
      code: `
        // Function to check if user is in blacklist
        function checkAccess(user, blacklist, whitelist) {
          if (blacklist.includes(user.id)) return false;
          if (whitelist.includes(user.id)) return true;
          return false;
        }
        
        // Master-slave replication
        const masterNode = new Node('master');
        const slaveNode = new Node('slave');
      `,
      expectedDetections: {
        representation: true,
        functional: false,
        performance: false,
        accessibility: false
      },
      expectedInstances: 4 // blacklist, whitelist, master, slave
    },
    
    {
      name: "Functional Bias - Region-specific Assumptions",
      code: `
        // Format user's address
        function formatAddress(address) {
          return \`\${address.street}\\n\${address.city}, \${address.state} \${address.zipCode}\`;
        }
        
        // Format user's phone number
        function formatPhone(phone) {
          return \`(\${phone.substring(0, 3)}) \${phone.substring(3, 6)}-\${phone.substring(6)}\`;
        }
      `,
      expectedDetections: {
        representation: false,
        functional: true,
        performance: false,
        accessibility: false
      },
      expectedInstances: 2 // US-centric address format, US-centric phone format
    },
    
    // Add more test cases for other bias types
  ];
  
  const biasSystem = new BiasManagementSystem({ autoMitigate: true });
  const testResults = [];
  
  for (const testCase of testCases) {
    console.log(`Running test: ${testCase.name}`);
    
    const result = await biasSystem.processcode(testCase.code);
    
    // Verify detection results
    const detectionMatch = Object.entries(testCase.expectedDetections).every(
      ([biasType, expected]) => 
        result.detectionResults.detailedResults[biasType].biasDetected === expected
    );
    
    // Count total instances detected
    const totalInstances = Object.values(result.detectionResults.detailedResults)
      .reduce((sum, typeResult) => sum + typeResult.instances.length, 0);
    
    const instancesMatch = totalInstances === testCase.expectedInstances;
    
    // Check if mitigation was applied when needed
    const mitigationApplied = result.mitigationResults !== null && 
                            result.mitigationResults.codeChanged;
    
    const mitigationNeeded = Object.values(testCase.expectedDetections)
                            .some(expected => expected === true);
    
    const mitigationMatch = mitigationNeeded === mitigationApplied;
    
    testResults.push({
      testCase: testCase.name,
      passed: detectionMatch && instancesMatch && mitigationMatch,
      detectionMatch,
      instancesMatch,
      mitigationMatch,
      details: {
        expectedDetections: testCase.expectedDetections,
        actualDetections: Object.fromEntries(
          Object.entries(result.detectionResults.detailedResults)
            .map(([k, v]) => [k, v.biasDetected])
        ),
        expectedInstances: testCase.expectedInstances,
        actualInstances: totalInstances
      }
    });
  }
  
  // Report test results
  console.log('\nTest Results:');
  console.log('=============');
  
  for (const testResult of testResults) {
    console.log(`${testResult.passed ? '✅' : '❌'} ${testResult.testCase}`);
    
    if (!testResult.passed) {
      console.log('  Details:');
      if (!testResult.detectionMatch) {
        console.log('  - Detection mismatch:');
        console.log('    Expected:', testResult.details.expectedDetections);
        console.log('    Actual:', testResult.details.actualDetections);
      }
      
      if (!testResult.instancesMatch) {
        console.log('  - Instance count mismatch:');
        console.log('    Expected:', testResult.details.expectedInstances);
        console.log('    Actual:', testResult.details.actualInstances);
      }
      
      if (!testResult.mitigationMatch) {
        console.log('  - Mitigation mismatch');
      }
    }
  }
  
  return testResults;
}

// Run the tests
runBiasSystemTests();
```

## Deliverables

For this exercise, your deliverables should include:

1. A fully implemented Bias Detection and Mitigation System with the following components:
   - BiasDetectionSystem class with at least 2 detector implementations
   - BiasMitigationSystem class with at least 2 strategy implementations
   - BiasManagementSystem class to integrate detection and mitigation
   - BiasContinuousImprovement class for learning and adaptation

2. A comprehensive test suite demonstrating the system's capabilities

3. Documentation including:
   - System architecture diagram
   - User guide for integrating the system into a development workflow
   - Description of bias types detected and mitigation strategies
   - Recommendations for expanding the system

## Bonus Challenges

1. **IDE Integration**: Create a simple VSCode extension or CLI tool that integrates your bias detection system
2. **Multi-language Support**: Extend your system to support multiple programming languages
3. **Feedback System**: Implement a user feedback mechanism to improve bias detection accuracy
4. **Visualization**: Create a dashboard to visualize bias detection and mitigation metrics

## Evaluation Criteria

Your bias detection and mitigation system will be evaluated based on:

1. Effectiveness - How well does it detect and mitigate different types of bias?
2. Comprehensiveness - Does it address multiple bias types?
3. Usability - How easily can it be integrated into a development workflow?
4. Adaptability - Can it learn and improve over time?
5. Code quality - Is the implementation clean, efficient, and well-structured?

## Resources

- [Inclusive Naming Initiative](https://inclusivenaming.org/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Internationalization Best Practices](https://www.w3.org/International/quicktips/)
- [Ethical AI Design Patterns](https://example.com/ethical-ai-patterns) (fictional resource)
