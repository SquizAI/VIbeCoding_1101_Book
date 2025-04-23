# Effective Prompt Templates for Vibe Coding

This document provides reusable prompt templates for common Vibe Coding tasks, organized by complexity level and purpose.

## Prompt Template Structure

Effective prompts follow a consistent structure that provides necessary context and clear requests:

```mermaid
flowchart TD
    A[Prompt Structure] --> B[Context/Introduction]
    A --> C[Specific Request/Task]
    A --> D[Requirements/Constraints]
    A --> E[Expected Output Format]
    A --> F[Additional Information]
    
    B --> B1[Project type, domain, purpose]
    C --> C1[Clear action verbs, specific goals]
    D --> D1[Technical requirements, limitations]
    E --> E1[Deliverable format, structure]
    F --> F1[Examples, references, preferences]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style B fill:#d5e8d4,stroke:#333,stroke-width:2px
    style C fill:#d4f1f9,stroke:#333,stroke-width:2px
    style D fill:#ffe6cc,stroke:#333,stroke-width:2px
    style E fill:#e1d5e7,stroke:#333,stroke-width:2px
    style F fill:#fff2cc,stroke:#333,stroke-width:2px
```

## Basic Prompt Templates

### Project Initialization Template

```mermaid
graph TD
    A[Project Initialization Prompt] --> B[Project Type & Framework]
    A --> C[Main Functionality Description]
    A --> D[Specific Requirements]
    A --> E[Deliverables]
    
    D --> D1[Requirement 1]
    D --> D2[Requirement 2]
    D --> D3[Requirement 3]
    
    E --> E1[Project Structure]
    E --> E2[Necessary Files]
    E --> E3[Setup Instructions]
    
    style A fill:#d4f1f9,stroke:#333,stroke-width:2px
```

**Example Fields:**
- **Project Type**: Web app, CLI tool, data analysis script
- **Framework**: React, Django, Flask, Express
- **Main Functionality**: User authentication, data visualization, API integration
- **Requirements**: Responsive design, offline support, accessibility features
- **Deliverables**: Folder structure diagram, configuration files, README content

### Code Explanation Template

```mermaid
graph TD
    A[Code Explanation Prompt] --> B[Request for Explanation]
    A --> C[Code Block to Explain]
    A --> D[Explanation Focus Areas]
    
    D --> D1[Section Functionality]
    D --> D2[Important Concepts]
    D --> D3[Potential Improvements]
    
    style A fill:#ffe6cc,stroke:#333,stroke-width:2px
```

**Example Request:** "Explain this authentication middleware function in simple terms, focusing on the JWT verification process and security implications."

### Bug Fixing Template

```mermaid
flowchart TD
    A[Bug Fixing Prompt] --> B[Problem Statement]
    A --> C[Code Block with Bug]
    A --> D[Error Message]
    A --> E[Expected vs Actual Behavior]
    A --> F[Request for Solution]
    
    style A fill:#e1d5e7,stroke:#333,stroke-width:2px
```

**Key Elements:**
- **Problem Statement**: Clear description of the issue
- **Code Context**: Relevant code section with sufficient context
- **Error Details**: Exact error messages or unexpected outputs
- **Behavior Comparison**: What should happen vs. what actually happens
- **Solution Request**: Specific help needed (identify cause, suggest fix, explain solution)

## Intermediate Prompt Templates

### Feature Implementation Template

```mermaid
graph TD
    A[Feature Implementation Prompt] --> B[Project Context]
    A --> C[Current Code Base]
    A --> D[Feature Requirements]
    A --> E[Technical Constraints]
    A --> F[Quality Expectations]
    
    D --> D1[Requirement 1]
    D --> D2[Requirement 2]
    D --> D3[Requirement 3]
    
    E --> E1[Constraint 1]
    E --> E2[Constraint 2]
    
    F --> F1[Best Practices]
    F --> F2[Error Handling]
    F --> F3[Documentation]
    
    style A fill:#d5e8d4,stroke:#333,stroke-width:2px
    style D fill:#d4f1f9,stroke:#333,stroke-width:2px
    style F fill:#ffe6cc,stroke:#333,stroke-width:2px
```

**Template Structure:**

1. **Introduction**: Brief description of the project and its current state
2. **Feature Need**: Clear description of the feature to be implemented
3. **Current Context**: Relevant existing code snippets
4. **Requirements List**: Numbered list of specific requirements
5. **Constraints**: Technical limitations or compatibility requirements
6. **Quality Standards**: Expectations for the implementation quality

### Code Refactoring Template

```mermaid
flowchart TD
    A[Code Refactoring Prompt] --> B[Improvement Focus]
    A --> C[Original Code]
    A --> D[Specific Concerns]
    A --> E[Improvement Goals]
    A --> F[Functional Requirements]
    
    B --> B1[Performance]
    B --> B2[Readability]
    B --> B3[Maintainability]
    
    D --> D1[Concern 1]
    D --> D2[Concern 2]
    
    E --> E1[Goal 1]
    E --> E2[Goal 2]
    
    F -->|Must Maintain| F1[Existing Functionality]
    
    style A fill:#f9d5e5,stroke:#333,stroke-width:2px
    style B fill:#d5e8d4,stroke:#333,stroke-width:2px
    style F fill:#e1d5e7,stroke:#333,stroke-width:2px
```

**Refactoring Focus Areas:**

- **Performance**: Execution speed, memory usage, resource efficiency
- **Readability**: Clear variable names, consistent style, self-documenting
- **Maintainability**: Modular design, reduced complexity, separation of concerns
- **Specific Concerns**: Identified issues like duplicate code or complex conditions
- **Improvement Goals**: Quantifiable targets like "reduce function length by 50%"

## Advanced Prompt Templates

### Architecture Design Template

```mermaid
graph TD
    A[Architecture Design Prompt] --> B[System Type & Purpose]
    A --> C[Technical Requirements]
    A --> D[Requested Deliverables]
    
    C --> C1[Traffic Volume]
    C --> C2[Data Storage Needs]
    C --> C3[Integration Points]
    C --> C4[Security Requirements]
    C --> C5[Scalability Needs]
    
    D --> D1[Architecture Diagram]
    D --> D2[Component Descriptions]
    D --> D3[Data Flow Explanation]
    D --> D4[Technology Recommendations]
    D --> D5[Challenges & Solutions]
    
    style A fill:#e1d5e7,stroke:#333,stroke-width:2px
    style C fill:#d5e8d4,stroke:#333,stroke-width:2px
    style D fill:#d4f1f9,stroke:#333,stroke-width:2px
```

**Architecture Design Elements:**
- **System Purpose**: Clear definition of the system's main function
- **Technical Requirements**: Specific metrics and constraints
- **Integration Context**: External systems and APIs
- **Expected Deliverables**: Defined artifacts to be produced

### Performance Optimization Template

```mermaid
flowchart TD
    A[Performance Optimization Prompt] --> B[Problem Statement]
    A --> C[Current Metrics]
    A --> D[System Specifications]
    A --> E[Code Context]
    A --> F[Expected Solutions]
    
    C --> C1[Metric 1: Value]
    C --> C2[Metric 2: Value]
    
    D --> D1[Hardware/Cloud Resources]
    D --> D2[Current Configuration]
    
    F --> F1[Immediate Actions]
    F --> F2[Medium-term Changes]
    F --> F3[Monitoring Suggestions]
    
    style A fill:#fff2cc,stroke:#333,stroke-width:2px
    style C fill:#f8cecc,stroke:#333,stroke-width:2px
    style F fill:#d5e8d4,stroke:#333,stroke-width:2px
```

**Optimization Components:**
- **Baseline Metrics**: Current performance measurements
- **System Context**: Hardware, software, and configuration details
- **Problem Conditions**: When and how issues occur
- **Solution Timeframes**: Short-term fixes vs architectural improvements
- **Monitoring Strategy**: How to verify improvements

### AI Collaboration Pattern Template

```mermaid
graph TD
    A[Collaboration Pattern Prompt] --> B[Project Description]
    A --> C[Project Context]
    A --> D[Collaboration Expectations]
    A --> E[Working Style Preferences]
    A --> F[Collaboration Framework]
    
    C --> C1[Key Information]
    C --> C2[Current Progress]
    C --> C3[Project Goals]
    
    D --> D1[Expectation 1]
    D --> D2[Expectation 2]
    D --> D3[Expectation 3]
    
    E --> E1[Interaction Style]
    E --> E2[Detail Level]
    E --> E3[Decision Process]
    
    F --> F1[Communication Framework]
    F --> F2[Progress Tracking]
    F --> F3[Review Process]
    
    style A fill:#d4f1f9,stroke:#333,stroke-width:2px
    style C fill:#d5e8d4,stroke:#333,stroke-width:2px
    style E fill:#e1d5e7,stroke:#333,stroke-width:2px
```

**Effective Collaboration Setup:**
- **Project Context**: The what, why, and current state
- **Clear Expectations**: Specific roles and deliverables
- **Working Style**: Communication preferences and decision processes
- **Process Framework**: How progress will be tracked and reviewed
