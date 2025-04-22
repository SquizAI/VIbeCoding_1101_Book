# Exercise: React Native Basics - Task Management App

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_7-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 7" />
  <h1>Building a Task Management Mobile App</h1>
  
  <p><i>"Learning the fundamentals of React Native development through a practical task tracker"</i></p>
</div>

<hr/>

## Overview

In this exercise, you will build a simple but functional task management application using React Native and Expo. This project will help you understand the fundamentals of mobile development, including component structure, state management, user input, and persistent storage. The exercise is designed to be completed with the assistance of AI tools following the Vibe Coding approach.

## Learning Objectives

- Set up a React Native development environment with Expo
- Create and style mobile UI components
- Implement state management for a mobile application
- Handle user input and form validation
- Implement persistent storage using AsyncStorage
- Add basic navigation between screens
- Understand mobile-specific considerations and patterns

## Prerequisites

- Basic knowledge of JavaScript
- Familiarity with React concepts (components, props, state)
- Node.js and npm installed
- A smartphone with Expo Go app installed (or an emulator/simulator)

## Exercise Steps

### 1. Setting Up Your Development Environment

**Task:** Initialize a new React Native project using Expo.

**Requirements:**
- Create a new Expo project named "TaskTracker"
- Ensure the project structure is properly set up
- Run the project on your device or simulator

**Prompt Example:**
```
I want to create a new React Native project using Expo for a task management app. 
Please help me set up the project with the name "TaskTracker" and explain how to run it on my device or simulator.
```

### 2. Creating the Task List Component

**Task:** Create the main task list component that will display all tasks.

**Requirements:**
- Create a component that displays a list of tasks
- Each task should show its title and completion status
- Include a way to mark tasks as complete/incomplete
- Implement the ability to delete tasks
- Style the component appropriately for mobile

**Prompt Example:**
```
Now I need a TaskList component for my React Native app that:
1. Displays a list of tasks with their titles
2. Shows whether each task is complete or incomplete
3. Allows marking tasks as complete/incomplete with a tap
4. Includes a delete button for each task
5. Has appropriate styling for a mobile interface

Here's my initial task data structure:
[
  { id: '1', title: 'Complete React Native exercise', completed: false },
  { id: '2', title: 'Learn about AsyncStorage', completed: false }
]
```

### 3. Creating the Task Input Form

**Task:** Implement a form for adding new tasks.

**Requirements:**
- Create an input field for the task title
- Add a button to submit the new task
- Implement validation (e.g., prevent empty tasks)
- Clear the input after submission
- Style the form for mobile interaction

**Prompt Example:**
```
I need a TaskInput component for my React Native app that:
1. Has a text input field for entering a new task title
2. Includes an "Add" button to submit the task
3. Prevents empty tasks from being added
4. Clears the input field after submission
5. Is styled appropriately for mobile (good touch target sizes, etc.)
```

### 4. Implementing State Management

**Task:** Implement state management for the tasks.

**Requirements:**
- Create a state to store the list of tasks
- Implement functions to add, toggle, and delete tasks
- Connect these functions to the components
- Ensure the UI updates when the state changes

**Prompt Example:**
```
I need to implement state management for my TaskTracker app:
1. Store tasks in state (with title, completed status, and unique id)
2. Create a function to add new tasks
3. Create a function to toggle task completion status
4. Create a function to delete tasks
5. Connect these functions to my TaskList and TaskInput components

I'm comfortable using either useState or useReducer, whichever you recommend for this use case.
```

### 5. Adding Persistent Storage

**Task:** Make the tasks persist between app restarts using AsyncStorage.

**Requirements:**
- Save tasks to AsyncStorage whenever they change
- Load tasks from AsyncStorage when the app starts
- Handle errors and edge cases
- Add appropriate loading states

**Prompt Example:**
```
I want my tasks to persist when the user closes and reopens the app:
1. Please help me implement AsyncStorage to save and load tasks
2. Save tasks whenever they are added, toggled, or deleted
3. Load tasks when the app first starts
4. Add error handling for storage operations
5. Show a loading indicator while tasks are being loaded
```

### 6. Adding Navigation

**Task:** Implement a simple navigation system with multiple screens.

**Requirements:**
- Add React Navigation to the project
- Create a home screen with the task list
- Add a screen for task details when a task is tapped
- Implement a screen for app settings (theme, clear all tasks)
- Style the navigation elements appropriately

**Prompt Example:**
```
I'd like to add navigation to my TaskTracker app:
1. Please help me set up React Navigation
2. Create these screens:
   - Home screen with the task list
   - Task details screen when a task is tapped (showing description, date, etc.)
   - Settings screen with options to clear all tasks and toggle dark/light theme
3. Add a bottom tab navigator or drawer for navigation between main screens
4. Style the navigation elements to match the app's design
```

### 7. Adding Finishing Touches

**Task:** Enhance the app with polish and additional features.

**Requirements:**
- Add a dark/light theme toggle
- Implement swipe-to-delete functionality
- Add task categories or priorities
- Implement task sorting options
- Add simple animations for better user experience

**Prompt Example:**
```
I'd like to add some polish to my TaskTracker app:
1. Implement a dark/light theme toggle in settings
2. Add swipe-to-delete functionality for tasks
3. Allow users to assign priority levels to tasks (high, medium, low)
4. Add the ability to sort tasks by priority or completion status
5. Implement simple animations when adding/completing/removing tasks
```

## Testing Your Application

Test your application on both iOS and Android platforms (or emulators) to ensure consistent functionality and appearance. Check:

1. Task creation, completion, and deletion
2. Data persistence between app restarts
3. Navigation between screens
4. Theme switching functionality
5. UI appearance on different screen sizes

## Submission Guidelines

Your completed exercise should include:

1. The full source code of your TaskTracker app
2. A README file with:
   - Setup instructions
   - Features implemented
   - Screenshots of the app
   - Challenges faced and how you overcame them
   - Future improvements you'd like to make
3. A short demonstration video showing the app in action (optional)

## Bonus Challenges

If you complete the main exercise and want more challenges:

1. **Add user authentication**
   - Implement a simple login/registration system
   - Secure tasks to specific users

2. **Implement task reminders**
   - Add due dates to tasks
   - Create local notifications for upcoming tasks

3. **Synchronize with a backend**
   - Create a simple backend API (or use a BaaS like Firebase)
   - Sync tasks between devices

4. **Add offline capabilities**
   - Implement proper offline-first functionality
   - Handle synchronization conflicts

5. **Create a widget**
   - Add a home screen widget showing upcoming tasks (platform-specific)

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/docs/usage/)

<hr/>

<div align="center">
  <h3>🧭 Continue Your Learning Journey</h3>
</div>

<div align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/📋_Chapter_Overview-teal?style=for-the-badge" alt="Chapter Overview" /></a>
  <a href="../exercises"><img src="https://img.shields.io/badge/🏋️_More_Exercises-coral?style=for-the-badge" alt="More Exercises" /></a>
</div>

<div align="center">
  <a href="../../README.md"><img src="https://img.shields.io/badge/🏠_Course_Home-pink?style=flat-square" alt="Course Home" /></a>
</div>

<div align="center">
  <p><em>© 2025 Vibe Coding. Transform the way you build software with AI-human collaboration!</em></p>
</div>
