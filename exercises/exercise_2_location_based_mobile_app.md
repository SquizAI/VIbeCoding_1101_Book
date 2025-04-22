# Exercise: Building a Location-Based Mobile Application

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_7-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 7" />
  <h1>Location-Based Mobile Application</h1>
  
  <p><i>"Harnessing device GPS capabilities to create an interactive mapping experience"</i></p>
</div>

<hr/>

## Overview

In this intermediate exercise, you will build a location-based mobile application that leverages the GPS capabilities of mobile devices. The app will allow users to track their location, mark points of interest, and discover nearby locations based on their current position. This exercise introduces important mobile-specific APIs and libraries while reinforcing core mobile development concepts.

## Learning Objectives

- Implement location services and permissions in a mobile application
- Integrate with mapping libraries to display interactive maps
- Work with geolocation data and coordinate systems
- Create custom map markers and information windows
- Implement geofencing for location-based triggers
- Optimize battery usage for location-based features
- Handle different device capabilities and fallbacks

## Prerequisites

- Completion of the React Native Basics exercise or equivalent experience
- Understanding of React Native core concepts
- Familiarity with async/await and Promises
- Basic knowledge of map coordinates and geolocation concepts

## Exercise Steps

### 1. Project Setup with Maps Integration

**Task:** Create a new React Native project with map functionality.

**Requirements:**
- Initialize a new React Native project using Expo
- Install and configure necessary map libraries (e.g., react-native-maps)
- Set up proper permissions in app configuration
- Create a basic map component that renders on screen

**Prompt Example:**
```
I want to create a new React Native application with Expo called "NearMe" that will use location services and maps. Please help me:
1. Initialize the project
2. Install and configure react-native-maps
3. Set up the necessary location permissions for both iOS and Android
4. Create a basic component that displays a map centered on a default location
```

### 2. Implementing Location Services

**Task:** Add functionality to track and display the user's current location.

**Requirements:**
- Request and handle location permissions
- Implement current location detection
- Update the map to center on the user's location
- Add a marker for the user's current position
- Handle different permission scenarios gracefully

**Prompt Example:**
```
Now I need to implement location services in my NearMe app:
1. Request user permission to access location
2. Get the current location using the Geolocation API
3. Center the map on the user's current coordinates
4. Add a custom marker for the user's position
5. Handle cases where permission is denied or location is unavailable
6. Implement a location accuracy indicator
```

### 3. Creating Points of Interest

**Task:** Allow users to create and save points of interest.

**Requirements:**
- Implement a UI for adding new locations
- Save location data with title, description, and coordinates
- Display custom markers for saved locations
- Create a detail view for each saved location
- Implement persistent storage for saved locations

**Prompt Example:**
```
I need functionality for users to create and save points of interest:
1. Add a floating action button to create new locations
2. Create a form for entering location details (title, description, category)
3. Save the current coordinates along with the user input
4. Display a custom marker on the map for each saved location
5. Create a popup or modal that shows location details when a marker is tapped
6. Persist saved locations using AsyncStorage or a similar solution
```

### 4. Implementing Search and Discovery

**Task:** Add the ability to search for nearby places using a third-party API.

**Requirements:**
- Integrate with a places API (Google Places, Foursquare, etc.)
- Create a search interface for finding nearby locations
- Display search results on the map and in a list
- Allow filtering by category and distance
- Handle API request errors gracefully

**Prompt Example:**
```
I want to add place discovery functionality to my app:
1. Integrate with the Google Places API (or recommend another suitable API)
2. Create a search bar that allows users to find nearby places
3. Implement category filters (restaurants, cafes, attractions, etc.)
4. Display search results as markers on the map
5. Show a list view of results that can be tapped to center the map
6. Implement proper error handling for API requests
7. Add a loading indicator during searches
```

### 5. Implementing Geofencing

**Task:** Add geofencing capabilities to trigger notifications when entering or leaving areas.

**Requirements:**
- Create functionality to define circular geofences
- Implement background location monitoring
- Trigger local notifications when crossing geofence boundaries
- Manage battery usage efficiently
- Handle system restrictions on background processes

**Prompt Example:**
```
I'd like to add geofencing to my app:
1. Allow users to create geofences around their points of interest
2. Set up background location monitoring that balances accuracy and battery life
3. Trigger local notifications when the user enters or leaves a geofence
4. Create a management interface to view and edit active geofences
5. Implement proper battery optimization techniques
6. Handle different platform restrictions for background processes
```

### 6. Creating Route Navigation

**Task:** Implement turn-by-turn directions between locations.

**Requirements:**
- Add routing capabilities between points
- Display routes on the map
- Show distance and estimated travel time
- Support different transportation modes
- Implement step-by-step navigation instructions

**Prompt Example:**
```
I need to implement navigation features in my app:
1. Add the ability to get directions between the user's location and a point of interest
2. Display the route on the map with appropriate styling
3. Show distance and estimated travel time information
4. Support different transportation modes (walking, driving, transit)
5. Create a turn-by-turn instruction view
6. Implement rerouting when the user deviates from the path
```

### 7. Optimizing for Production

**Task:** Optimize the application for real-world use.

**Requirements:**
- Implement offline map caching
- Optimize battery usage for location tracking
- Add proper error handling and fallbacks
- Implement analytics for user interactions
- Create a polished UI with appropriate loading states

**Prompt Example:**
```
I want to optimize my app for real-world usage:
1. Implement offline map caching for areas the user frequently visits
2. Create an intelligent location tracking system that adjusts accuracy based on battery level
3. Add comprehensive error handling with user-friendly messages
4. Implement analytics to track feature usage (respecting privacy)
5. Polish the UI with proper loading states, transitions, and empty states
6. Optimize performance for older devices
```

## Testing Your Application

Test your application thoroughly across different scenarios:

1. Test in urban and rural areas with different GPS accuracies
2. Test permissions flows (accepting, denying, revoking permissions)
3. Test with network connectivity issues
4. Test battery consumption during extended use
5. Test on different device sizes and operating system versions

## Submission Guidelines

Your completed exercise should include:

1. The full source code of your location-based app
2. A README file with:
   - Setup instructions including required API keys
   - Features implemented
   - Screenshots or GIFs of the app in action
   - Challenges faced and how you solved them
   - Known limitations and future improvements
3. A brief demonstration video showing key features (optional)

## Bonus Challenges

If you complete the main exercise and want more challenges:

1. **Implement augmented reality features**
   - Add AR markers for points of interest when viewed through the camera
   - Create an AR navigation mode with directional indicators

2. **Add social features**
   - Allow users to share locations with friends
   - Implement real-time location sharing with selected contacts
   - Create a friend discovery feature

3. **Implement advanced tracking**
   - Create activity tracking (walking, running, cycling)
   - Generate statistics and visualizations of movement patterns
   - Implement path recording and playback

4. **Create custom map styles**
   - Implement day/night mode for maps
   - Create themed map styles for different activities
   - Allow users to customize map appearance

5. **Add weather integration**
   - Display current weather at locations
   - Include weather forecasts for planned visits
   - Implement weather-based recommendations

## Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Geolocation API Documentation](https://reactnative.dev/docs/geolocation)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Background Geolocation Libraries](https://github.com/transistorsoft/react-native-background-geolocation)
- [Local Notifications in React Native](https://github.com/zo0r/react-native-push-notification)

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
