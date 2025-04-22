Draft of Chapter 3: Building Real Projects with AI Assistance

## **Objectives**

* Apply vibe coding principles to develop frontend components using AI tools  
* Implement advanced prompt engineering techniques for complex development tasks  
* Develop strategies for effective communication between frontend and backend systems  
* Create responsive user interfaces with AI-generated code  
* Analyze and refine AI-generated solutions for production-quality implementations  
* Evaluate when to use different AI tools for specific development scenarios

## **Key Terms**

Frontend Development: Creating the user-facing components of applications, typically using HTML, CSS, and JavaScript.

Component Architecture: A design methodology that breaks user interfaces into reusable, self-contained components.

API Integration: The process of connecting frontend applications to backend services through APIs (Application Programming Interfaces).

User Experience (UX): The overall experience of a user when interacting with an application, including usability, accessibility, and design elements.

Responsive Design: An approach to web design that makes web pages render well on various devices and window sizes.

Scaffolding: Rapidly generating the initial structure of an application or component.

Refactoring: Restructuring existing code without changing its external behavior to improve its internal structure.

## **Pre-writing Activity**

Analyze a successful web application you frequently useBefore we dive into building projects with AI assistance, take some time to analyze a web application you find particularly effective:

* What specific features make it intuitive and pleasant to use?  
* How is the interface organized? Can you identify distinct components?  
* What interactions between the frontend and backend are happening when you use the application?  
* How does the application adapt to different screen sizes or devices?

Consider how you might approach building a similar application with AI assistance. What aspects would you ask AI to help with? What parts would require your direct attention and creativity?

## **Introduction**

In the previous chapters, we established the philosophical foundation of vibe coding and set up our development environment. Now, we're ready to put these principles into practice by building real projects with AI assistance. This chapter focuses on applying vibe coding techniques to frontend development—creating the interfaces that users directly interact with and ensuring they communicate effectively with backend systems.

Frontend development presents unique challenges and opportunities for AI collaboration. On one hand, it involves visual design elements where human creativity and aesthetic judgment remain invaluable. On the other hand, it includes numerous patterns and repeatable structures that AI can effectively generate and adapt. Finding the right balance between human creativity and AI efficiency is the key to successful vibe coding in frontend contexts.

In this chapter, we'll explore how to leverage AI tools to rapidly scaffold projects, generate responsive components, implement common UI patterns, and integrate with backend services. We'll build on the prompt engineering fundamentals from Chapter 2, introducing advanced techniques specifically tailored for frontend development tasks. Throughout, we'll emphasize practical, hands-on approaches that you can immediately apply to your own projects.

By the end of this chapter, you'll be equipped to collaborate with AI to build sophisticated, user-facing applications—combining your design vision and domain knowledge with AI's ability to efficiently generate implementation code. This powerful combination allows you to focus on the unique aspects of your application while delegating routine implementation details to your AI assistant.

## **Body**

### **From Concept to Structure: Scaffolding Projects with AI**

One of the most powerful applications of vibe coding is rapidly transforming concepts into working project structures. Traditional development often begins with hours spent setting up boilerplate code, configuring build tools, and establishing project architecture. With AI assistance, this process can be compressed into minutes.

#### **Defining Your Project Vision**

Before engaging with AI tools, it's important to clearly articulate your project vision. This vision serves as the foundation for all subsequent prompts and interactions. A comprehensive project definition typically includes:

1. Core Functionality: What problem does your application solve? What are its primary features?  
2. User Personas: Who will use your application? What are their needs and expectations?  
3. Technical Requirements: What platforms must it support? What external services will it integrate with?  
4. Design Direction: What is the general aesthetic or UI/UX approach?  
5. Constraints: What limitations or requirements must be considered?

The more clearly you define these elements, the more effectively AI can help you scaffold your project.

#### **Scaffolding Strategies with AI**

Once your vision is clear, you can leverage AI to rapidly generate project structures. Here are effective approaches:

1. Full-Stack Scaffolding with Bolt.new:

Bolt.new specializes in generating complete project structures based on high-level descriptions. A well-crafted prompt can yield a fully functional starter application with properly configured frontend and backend components.Example Prompt for Bolt.new:

text

Apply to ai.ts

   Create a task management application with the following features:

   \- User authentication (email/password)

   \- Ability to create, edit, and delete tasks

   \- Categorization of tasks

   \- Due date tracking with reminders

   \- Responsive design for mobile and desktop

   

   Technical stack:

   \- React frontend with styled-components

   \- Node.js backend with Express

   \- MongoDB for data storage

   \- JWT for authentication

1. Component-Based Scaffolding with ChatGPT/Cursor:

For more targeted generation, you can use AI assistants to create specific components or modules within your project.Example Prompt for Component Generation:

text

Apply to ai.ts

   Create a React component for a task card with the following requirements:

   \- Display task title, description, due date, and priority

   \- Include options to mark as complete, edit, or delete

   \- Show a visual indicator for priority level (low/medium/high)

   \- Use styled-components for styling

   \- Include proper prop validation

   \- Follow functional component pattern with hooks

1. Configuration File Generation:

AI assistants excel at generating complex configuration files for build tools, linters, and deployment services.Example Prompt for Configuration Generation:

text

Apply to ai.ts

   Create a comprehensive webpack.config.js file for a React application with the following features:

   \- Development and production environments

   \- Hot module replacement for development

   \- CSS and SASS processing

   \- Image and font handling

   \- Environment variable support

   \- Bundle optimization for production

#### **Evaluating and Refining Generated Scaffolds**

AI-generated scaffolds provide an excellent starting point but typically require evaluation and refinement before becoming production-ready. When reviewing generated code:

1. Check Dependencies: Ensure all package versions are compatible and up-to-date.  
2. Verify Configuration: Confirm that configuration files align with project requirements.  
3. Test Basic Functionality: Run the scaffold to verify that core features work as expected.  
4. Identify Gaps: Note any missing elements that need to be addressed.  
5. Align with Best Practices: Assess whether the structure follows current best practices for your technology stack.

This evaluation process should be collaborative—use AI assistance to help address any issues you identify:

text

Apply to ai.ts

The project scaffold looks good overall, but I've identified a few issues:

1\. The webpack configuration is missing PostCSS support

2\. The authentication flow doesn't handle refresh tokens

3\. The component structure doesn't follow the atomic design pattern we prefer

Can you help me address these issues while maintaining the existing functionality?

By combining AI-generated scaffolds with thoughtful human evaluation, you can establish solid project foundations in a fraction of the time required by traditional methods.

### **Building Responsive UI Components with AI Assistance**

Once your project structure is in place, vibe coding can significantly accelerate the development of user interface components. This process leverages AI's ability to generate implementation code based on descriptions or examples, while still allowing you to guide the overall design direction.

#### **Component Design Patterns**

Effective UI development with AI assistance typically follows these patterns:

1. Specification-First Development: Clearly specify component requirements before requesting implementation.  
2. Example-Driven Generation: Provide examples of similar components as reference points.  
3. Iterative Refinement: Begin with basic implementations and progressively enhance them.  
4. Visual-to-Code Translation: Describe visual designs or mockups for AI to translate into code.  
5. Composition from Primitives: Build complex interfaces by combining simpler components.

#### **Crafting Effective Component Prompts**

The quality of your component prompts significantly impacts the usability of generated code. Here's a framework for crafting effective component prompts:Component Prompt Template:

text

Apply to ai.ts

Create a \[component type\] with the following characteristics:

Functionality:

\- \[Describe core functionality\]

\- \[List interactions and behaviors\]

\- \[Specify state management needs\]

Appearance:

\- \[Describe visual styling\]

\- \[Specify layout behavior\]

\- \[Mention responsive requirements\]

Technical Requirements:

\- \[Specify framework/library\]

\- \[Note any required dependencies\]

\- \[Mention patterns to follow\]

Integration Points:

\- \[Describe how this component interacts with others\]

\- \[Specify required props and events\]

\- \[Note any API interactions\]

Examples:

\[Provide similar components as reference\]

Example of a Well-Crafted Component Prompt:

text

Apply to ai.ts

Create a React ProductCard component with the following characteristics:

Functionality:

\- Display product information (image, name, price, rating)

\- Show an "Add to Cart" button that triggers an action

\- Implement a favorite/wishlist toggle

\- Show stock status with appropriate visual indicators

Appearance:

\- Card layout with shadowed container

\- Prominent product image at top

\- Clean typography with product name, price, and rating

\- Responsive behavior: grid layout on desktop, full width on mobile

\- Subtle hover effects to indicate interactivity

Technical Requirements:

\- Use React with TypeScript

\- Styled with CSS Modules or styled-components

\- Implement as a functional component with hooks

\- Include appropriate loading and error states

Integration Points:

\- Accept product data as a prop (image, name, price, rating, stock)

\- Expose callbacks for add-to-cart and favorite toggle actions

\- Should work within a product grid container

Examples:

Similar to Amazon or Shopify product cards with clean, minimal design

#### **Evaluating and Refining Generated Components**

AI-generated components typically require refinement to match exact requirements and design standards. When evaluating generated components, consider:

1. Functionality Completeness: Does it implement all required features?  
2. Responsive Behavior: Does it adapt appropriately to different screen sizes?  
3. Accessibility: Does it follow accessibility best practices?  
4. Performance: Is it optimized for rendering performance?  
5. Code Quality: Is the implementation clean, readable, and maintainable?

Use iterative prompts to refine components based on your evaluation:

text

Apply to ai.ts

The ProductCard component looks good, but I'd like to make these refinements:

1\. Improve accessibility by adding appropriate ARIA attributes

2\. Optimize the image loading with lazy loading and proper alt text

3\. Add a skeleton loading state for when product data is being fetched

4\. Implement error handling for missing product information

5\. Ensure consistent spacing using our design system variables

Please update the component with these improvements.

This iterative process combines AI efficiency with human direction, resulting in high-quality components that align with your specific requirements and standards.

### **Frontend-Backend Communication: Implementing APIs with AI**

One of the most challenging aspects of application development is establishing effective communication between frontend and backend systems. Vibe coding excels in this domain by helping generate robust API integration code based on endpoint specifications.

#### **Understanding API Integration Patterns**

Before leveraging AI for API integration, it's important to understand common patterns:

1. REST API Consumption: Structured requests to REST endpoints with appropriate error handling.  
2. GraphQL Queries: Declarative data fetching with precise specification of required fields.  
3. Real-time Communications: WebSocket or Server-Sent Events for live updates.  
4. Authentication Flows: Secure token management and request authorization.  
5. State Management: Synchronizing server state with client-side application state.

#### **AI-Assisted API Integration**

Here's how to effectively use AI to implement these patterns:API Integration Prompt Template:

text

Apply to ai.ts

Help me implement API integration for \[feature\] with the following details:

Endpoint Information:

\- \[Endpoint URL or pattern\]

\- \[HTTP method\]

\- \[Request payload structure\]

\- \[Response structure\]

\- \[Authentication requirements\]

Implementation Requirements:

\- \[Framework/library to use\]

\- \[Error handling expectations\]

\- \[Loading state management\]

\- \[Caching requirements\]

Additional Considerations:

\- \[Rate limiting concerns\]

\- \[Offline behavior\]

\- \[Retry strategies\]

Code Context:

\[Provide relevant existing code for context\]

Example of a Well-Crafted API Integration Prompt:

text

Apply to ai.ts

Help me implement API integration for fetching and displaying user tasks with the following details:

Endpoint Information:

\- GET /api/v1/tasks

\- Query parameters: status (optional), sort (optional), page (optional)

\- Response: JSON array of task objects with properties: id, title, description, dueDate, status, priority

\- Authentication: Bearer token in Authorization header

Implementation Requirements:

\- Use React Query for data fetching and state management

\- Implement error handling with user-friendly error messages

\- Show loading states while data is being fetched

\- Implement infinite scrolling for pagination

\- Cache results for 5 minutes

Additional Considerations:

\- Include retry logic for failed requests (max 3 retries with exponential backoff)

\- Implement optimistic updates when marking tasks as complete

\- Support offline mode by storing tasks in IndexedDB

Code Context:

We're using React with TypeScript and have a TaskList component that should display the fetched tasks.

#### **Testing and Debugging API Integrations**

AI-generated API integration code should be thoroughly tested to ensure reliability. For complex integrations, implement a testing strategy that includes:

1. Mock Server Testing: Using tools like MSW (Mock Service Worker) to simulate API responses.  
2. Edge Case Handling: Testing with empty responses, error conditions, and network failures.  
3. Authentication Flow Verification: Ensuring tokens are properly managed and refreshed.  
4. Performance Profiling: Measuring and optimizing request patterns.

AI can help generate these tests as well:

text

Apply to ai.ts

Generate Jest tests for our task API integration that cover the following scenarios:

1\. Successfully fetching tasks and updating the UI

2\. Handling API errors with appropriate user feedback

3\. Testing pagination behavior

4\. Verifying offline functionality

5\. Testing token refresh flows

By combining AI-generated implementation with rigorous testing, you can create robust API integrations that handle real-world conditions reliably.

### **Advanced UI Patterns and Interactions**

Modern applications require sophisticated UI patterns and interactions that enhance user experience. These patterns often involve complex state management and precise timing—areas where AI assistance can significantly accelerate implementation.

#### **Common Advanced UI Patterns**

Consider using AI to implement these advanced patterns:

1. Drag and Drop Interfaces: Sortable lists, kanban boards, or file uploaders.  
2. Infinite Scrolling: Dynamically loading content as users scroll.  
3. Complex Form Validation: Multi-step forms with contextual validation.  
4. Data Visualization: Charts, graphs, and interactive displays.  
5. Animations and Transitions: Smooth state transitions and motion design.  
6. Virtual Lists: Efficiently rendering large datasets.

#### **Implementing Advanced Patterns with AI**

For complex UI patterns, provide AI with detailed specifications and relevant context:Example Prompt for Advanced UI Pattern:

text

Apply to ai.ts

Help me implement a drag-and-drop kanban board with the following features:

Functionality:

\- Tasks represented as cards that can be dragged between columns

\- Columns representing task statuses (Todo, In Progress, Review, Done)

\- Visual feedback during drag operations

\- Animation when cards are moved

\- Persist changes to backend API after successful moves

\- Optimistic updates with rollback on failure

Technical Requirements:

\- Use React with TypeScript

\- Implement with react-beautiful-dnd library

\- Support keyboard accessibility for drag operations

\- Ensure smooth performance with potentially hundreds of cards

\- Include proper error handling and loading states

API Integration:

\- PATCH /api/v1/tasks/:id/status to update task status

\- Request body: { status: string }

\- Implement debounce to prevent excessive API calls

Context:

We already have Task and Column components. This implementation needs to coordinate the drag-and-drop behavior between them.

#### **Refining Complex Interactions**

Complex UI patterns often require multiple iterations to achieve the desired behavior. Use a collaborative approach:

1. Start with Core Functionality: First implement the basic interaction without refinements.  
2. Add Progressive Enhancements: Iteratively add animations, accessibility features, and error handling.  
3. Optimize Performance: Address performance considerations for smooth interactions.  
4. Polish User Experience: Fine-tune details like timing, easing functions, and visual feedback.

This iterative process leverages AI for implementation while allowing you to guide the refinement based on user experience goals.

### **Responsive Design and Cross-Device Compatibility**

Creating applications that work seamlessly across devices is essential in modern development. AI assistance can significantly streamline the implementation of responsive designs.

#### **Responsive Design Approaches**

Effective responsive design typically follows these approaches:

1. Mobile-First Development: Building for small screens first, then progressively enhancing for larger displays.  
2. Flexible Layouts: Using CSS techniques like flexbox and grid for adaptable layouts.  
3. Responsive Typography: Scaling text appropriately across device sizes.  
4. Adaptive Components: Modifying component behavior based on screen size or device capabilities.  
5. Performance Optimization: Ensuring fast loading and smooth operation on mobile devices.

#### **AI-Assisted Responsive Implementation**

Here's how to leverage AI for responsive implementation:Responsive Design Prompt Template:

text

Apply to ai.ts

Help me implement responsive behavior for \[component/feature\] with the following requirements:

Display Requirements:

\- \[Mobile view specifications\]

\- \[Tablet view specifications\]

\- \[Desktop view specifications\]

Technical Approach:

\- \[CSS methodology to use\]

\- \[Breakpoint strategy\]

\- \[Media query preferences\]

Considerations:

\- \[Touch interaction requirements\]

\- \[Performance considerations\]

\- \[Accessibility requirements\]

Context:

\[Provide existing component code\]

Example of a Well-Crafted Responsive Design Prompt:

text

Apply to ai.ts

Help me implement responsive behavior for our Dashboard layout with the following requirements:

Display Requirements:

\- Mobile (under 768px): Single column layout, collapsible navigation sidebar

\- Tablet (768px-1024px): Two-column layout for main content, semi-collapsed navigation

\- Desktop (above 1024px): Three-column layout with full navigation sidebar visible

Technical Approach:

\- Use CSS Grid for the main layout structure

\- Follow a mobile-first approach with progressive enhancement

\- Use container queries for component-level responsiveness where supported

\- Implement with styled-components

Considerations:

\- Navigation should be accessible via a hamburger menu on mobile

\- Dashboard widgets should reflow based on available space

\- Interactive elements need appropriate touch targets (minimum 44x44px)

\- Ensure text remains readable at all sizes (minimum 16px font)

Context:

Our Dashboard is composed of a Navigation component, a main content area with Widget components, and a secondary sidebar for notifications and quick actions.

#### **Testing Responsive Implementations**

Thorough testing is essential for responsive designs. AI can help generate comprehensive test plans:

text

Apply to ai.ts

Create a responsive testing plan for our application that covers:

1\. Specific device breakpoints to test (list key devices and resolutions)

2\. Critical user flows to verify on each device size

3\. Accessibility verification steps

4\. Performance benchmarks to measure

5\. Browser compatibility matrix

Include instructions for using Chrome DevTools and other testing tools to efficiently conduct this testing.

By combining AI-generated responsive implementations with systematic testing, you can ensure your application provides a consistent, high-quality experience across all devices.

### **Case Study: Building a Complete Feature with Vibe Coding**

To illustrate the practical application of vibe coding principles, let's walk through a case study of building a complete feature using AI assistance: a task management system with filtering, sorting, and visualization capabilities.

#### **Feature Definition**

We begin by clearly defining the feature:

text

Apply to ai.ts

Feature: Task Management Dashboard

Purpose:

Create a comprehensive task management interface that allows users to view, filter, sort, and analyze their tasks.

Key Components:

1\. Task List View with filtering and sorting options

2\. Task Analytics Dashboard with charts showing task distribution

3\. Task Detail Modal for viewing and editing task details

4\. Quick Add Task interface

User Requirements:

\- Users need to quickly find tasks based on status, priority, and due date

\- Users want visual representations of their task progress and distribution

\- Users need to be able to update task details efficiently

\- The interface should be responsive and work well on mobile devices

Technical Requirements:

\- React frontend with TypeScript

\- RESTful API integration for task data

\- Real-time updates when task status changes

\- Responsive design for all screen sizes

#### **Step 1: Architecture Planning with AI**

First, we use AI to plan the component architecture:Prompt:

text

Apply to ai.ts

Based on our Task Management Dashboard feature requirements, help me plan a component architecture that follows best practices. Include:

1\. Component hierarchy and relationships

2\. State management approach

3\. Data flow between components

4\. Key interfaces/types for data models

5\. A visual representation of the architecture (ASCII diagram is fine)

#### **Step 2: Scaffolding Components**

Next, we generate the core components:Prompt:

text

Apply to ai.ts

Generate the TaskList component with the following features:

\- Display tasks in a responsive table/list format

\- Include columns for task name, status, priority, due date, and actions

\- Implement filtering by status, priority, and due date range

\- Enable sorting by any column

\- Include a search box for filtering by task name

\- Support pagination or infinite scrolling

\- Show appropriate loading and empty states

Use React with TypeScript and styled-components. Include proper type definitions and handle all edge cases.

#### **Step 3: Implementing API Integration**

With components scaffolded, we implement API integration:Prompt:

text

Apply to ai.ts

Implement the API integration for our Task Management feature with these requirements:

\- Fetch tasks with GET /api/tasks (supports query parameters for filtering/sorting)

\- Create tasks with POST /api/tasks

\- Update tasks with PATCH /api/tasks/:id

\- Delete tasks with DELETE /api/tasks/:id

\- Implementation should use React Query

\- Include error handling, loading states, and optimistic updates

\- Support offline mode with background synchronization

Provide the implementation along with any custom hooks we should create.

#### **Step 4: Building the Analytics Dashboard**

For data visualization, we leverage AI's knowledge of charting libraries:Prompt:

text

Apply to ai.ts

Create a TaskAnalytics component that visualizes task data with these charts:

1\. Task distribution by status (pie chart)

2\. Tasks by priority (bar chart)

3\. Tasks by due date (line chart showing upcoming deadlines)

4\. Completion trend over time (area chart)

Use React with TypeScript and Recharts library. The component should be responsive and include proper loading/error states. Data should update automatically when task data changes.

#### **Step 5: Implementing the Task Detail Modal**

For complex interactions, we provide detailed specifications:Prompt:

text

Apply to ai.ts

Implement a TaskDetailModal component with these requirements:

\- Display all task details: title, description, status, priority, due date, assignee, etc.

\- Allow editing of all fields with appropriate input controls

\- Include form validation for required fields

\- Show confirmation for destructive actions

\- Implement with React, TypeScript, and styled-components

\- Use React Hook Form for form management

\- Ensure accessibility (keyboard navigation, ARIA attributes)

\- Include animations for opening/closing

#### **Step 6: Responsive Design Implementation**

Finally, we ensure cross-device compatibility:Prompt:

text

Apply to ai.ts

Help me implement responsive behavior for our Task Management Dashboard with these requirements:

\- Mobile view: Stack all components vertically, simplify task list to essential columns

\- Tablet view: Two-column layout for analytics, full task list with horizontal scrolling

\- Desktop view: Multi-column layout with sidebar filters and expanded analytics

Implement with CSS Grid and media queries. Include specific breakpoints and ensure all interactive elements have appropriate touch targets on mobile.

#### **Step 7: Testing and Refinement**

We use AI to assist with testing and quality assurance:Prompt:

text

Apply to ai.ts

Generate Jest tests for our Task Management components covering:

1\. Component rendering with various data states

2\. User interactions and event handling

3\. API integration functionality

4\. Filter and sort operations

5\. Responsive behavior verification

Include both unit tests and integration tests. Mock any external dependencies appropriately.

This comprehensive case study demonstrates how vibe coding enables rapid implementation of complex features by leveraging AI assistance throughout the development process. Each step builds on the previous ones, with AI handling implementation details while you guide the overall direction and quality standards.

## **Conclusion**

In this chapter, we've explored the practical application of vibe coding principles to build real frontend projects with AI assistance. We've seen how this approach transforms the development process—from rapid scaffolding and component generation to implementing complex interactions and ensuring cross-device compatibility.The key insights from this exploration include:

1. AI Accelerates Implementation: Tasks that traditionally take hours or days can be compressed into minutes by leveraging AI for code generation, while maintaining high quality standards.  
2. Prompt Crafting is Critical: The quality of your prompts directly impacts the quality of generated code. Detailed, well-structured prompts that clearly communicate requirements lead to better results.  
3. Iterative Refinement Works Best: Rather than expecting perfect code from a single prompt, approaching development as a conversation with progressive refinement yields superior outcomes.  
4. Human Direction Remains Essential: While AI handles implementation details, human developers provide critical direction, quality standards, and creative vision that shape the final product.  
5. Collaboration Amplifies Strengths: The most effective vibe coding happens when humans and AI each focus on their strengths—humans on design thinking, user empathy, and quality assessment; AI on pattern implementation, boilerplate generation, and technical consistency.

As you apply these principles to your own projects, remember that vibe coding is not about replacing development skills, but about amplifying them. By delegating routine implementation tasks to AI, you free your creative and analytical capabilities to focus on the aspects of development that truly differentiate your applications—user experience, novel features, and elegant solutions to complex problems.In the next chapter, we'll build on these frontend foundations to explore how vibe coding principles extend to backend development, including database design, API implementation, and system architecture.

## **Reading 3.1: "Component Design Patterns in the Age of AI"**

## **Discussion Questions**

1. How does the process of designing components change when working with AI assistance? What aspects of component design remain fundamentally human-driven?  
2. Compare the traditional approach to responsive design with the AI-assisted approach described in this chapter. What efficiencies emerge, and what new challenges might arise?  
3. Consider the case study presented in this chapter. How might you approach the same problem differently? What additional prompts might improve the implementation?  
4. How does the quality of AI-generated code for frontend components compare to manually written code? What criteria would you use to evaluate these differences?  
5. What ethical considerations might arise when using AI to build user interfaces? How should developers address concerns about accessibility, inclusivity, and cultural sensitivity?

## **Bibliography/References**

Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., ... & Amodei, D. (2020). "Language models are few-shot learners." Advances in neural information processing systems, 33, 1877-1901.

Fried, D., Aghajanyan, A., Lin, J., Wang, S., Wallace, E., Shi, F., ... & Zettlemoyer, L. (2023). "InCoder: A generative model for code infilling and synthesis." arXiv preprint arXiv:2204.05999.

Peng, Z., Zhang, J., Li, R., Marcus, R., Xiao, T., Zha, S., ... & Andreas, J. (2023). "APE: Automatic programming with execution-based state modeling." arXiv preprint arXiv:2304.06464.

Wilson, G., Bryan, J., Cranston, K., Kitzes, J., Nederbragt, L., & Teal, T. K. (2017). "Good enough practices in scientific computing." PLOS Computational Biology, 13(6), e1005510.

Vaithilingam, P., Zhang, T., & Glassman, E. L. (2022). "Expectation vs. experience: Evaluating the usability of code generation tools powered by large language models." CHI Conference on Human Factors in Computing Systems Extended Abstracts.

Barke, S., James, M. B., & Polikarpova, N. (2023). "Grounded Copilot: How Programmers Interact with Code-Generating Models." OOPSLA 1\.

