# Exercise: React Native Basics - Task Management App (2025 Edition)

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">
  <h1>Building a Modern Task Management Mobile App</h1>
  
  <p><i>"Learning the fundamentals of React Native development through a practical task tracker"</i></p>
</div>

<hr/>

## Overview

In this exercise, you will build a functional task management application using React Native with the latest 2025 patterns and practices. This project will help you understand the fundamentals of mobile development, including component structure, state management, user input, and persistent storage. The exercise is designed to be completed with the assistance of AI tools following the Vibe Coding approach.

## Learning Objectives

- Set up a React Native development environment with React Native CLI or Expo
- Create and style mobile UI components using modern patterns
- Implement state management for a mobile application
- Handle user input and form validation
- Implement persistent storage
- Add navigation between screens
- Apply responsive design principles
- Understand mobile-specific considerations

## Prerequisites

- Basic understanding of JavaScript/TypeScript
- Node.js and npm installed on your computer
- Code editor (VS Code recommended)
- Android Studio or Xcode (optional, for native builds)

## Project Requirements

### Core Features

1. **Task Management**
   - Create new tasks with title, description, and due date
   - Mark tasks as complete
   - Delete tasks
   - Filter tasks (all, active, completed)

2. **User Interface**
   - Modern, intuitive interface that follows platform conventions
   - Responsive design that works on various screen sizes
   - Dark/light mode support
   - Smooth animations and transitions

3. **Data Persistence**
   - Save tasks locally using AsyncStorage or MMKV
   - Load saved tasks when the app starts

4. **Navigation**
   - Main task list screen
   - Task detail screen
   - Add/edit task screen
   - Settings screen

## Implementation Steps

### Step 1: Set Up Your Development Environment

```bash
# Using React Native CLI
npx react-native init TaskManagerApp --template react-native-template-typescript

# OR using Expo
npx create-expo-app TaskManagerApp --template with-typescript
```

### Step 2: Project Structure

Organize your project with a clean, maintainable structure:

```
src/
├── assets/          # Images, fonts, etc.
├── components/      # Reusable UI components
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── ...
├── navigation/      # Navigation setup
│   └── index.tsx
├── screens/         # Screen components
│   ├── HomeScreen.tsx
│   ├── TaskDetailScreen.tsx
│   ├── AddTaskScreen.tsx
│   └── SettingsScreen.tsx
├── services/        # API and other services
│   └── storage.ts
├── styles/          # Global styles
│   └── theme.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── utils/           # Utility functions
    └── dateUtils.ts
```

### Step 3: Define Your Data Models

Create TypeScript interfaces for your data:

```typescript
// src/types/index.ts

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}
```

### Step 4: Create Reusable Components

Start with the TaskItem component:

```typescript
// src/components/TaskItem.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, task.isCompleted && styles.completedTask]}
      onPress={() => onPress(task.id)}
    >
      <TouchableOpacity 
        style={[styles.checkbox, task.isCompleted && styles.checked]}
        onPress={() => onToggleComplete(task.id)}
      />
      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        {task.dueDate ? (
          <Text style={styles.dueDate}>
            Due: {task.dueDate.toLocaleDateString()}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0066cc',
    marginRight: 16,
  },
  checked: {
    backgroundColor: '#0066cc',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#0066cc',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
});
```

### Step 5: Implement State Management

Create a storage service:

```typescript
// src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = 'tasks_storage_key';

export const StorageService = {
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  async loadTasks(): Promise<Task[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      if (jsonValue !== null) {
        const tasks = JSON.parse(jsonValue);
        // Convert string dates back to Date objects
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },
};
```

### Step 6: Create the Home Screen

```typescript
// src/screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { StorageService } from '../services/storage';
import { Task } from '../types';

type FilterType = 'all' | 'active' | 'completed';

export const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const savedTasks = await StorageService.loadTasks();
    setTasks(savedTasks);
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
          onPress={() => setFilter('active')}
        >
          <Text style={styles.filterText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add a new task
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});
```

## Expansion Ideas

Once you've completed the basic implementation, consider enhancing your app with these features:

1. **Task Categories/Tags**
   - Allow users to categorize tasks and filter by category

2. **Advanced Notifications**
   - Add reminders for upcoming tasks using local notifications

3. **Cloud Sync**
   - Synchronize tasks across devices using Firebase or another backend

4. **Analytics**
   - Implement task completion analytics and visualizations

5. **Drag and Drop**
   - Allow users to reorder tasks using drag and drop

6. **Voice Input**
   - Add the ability to create tasks using voice commands

## Challenge: AI Prompt Engineering

Practice your prompt engineering skills by creating prompts for an AI assistant to help implement specific features. For example:

- "Help me implement a color-coded priority system for tasks in my React Native app"
- "Create a custom animation for completing a task in React Native"
- "Design an efficient algorithm for sorting tasks by due date, priority, and completion status"

## Submission Guidelines

For this exercise, create a GitHub repository with your implementation and submit the link. Include:

1. Complete source code
2. A README with setup instructions
3. Screenshots of your app
4. A brief write-up of challenges you faced and how you overcame them
5. Examples of AI prompts you used during development

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
