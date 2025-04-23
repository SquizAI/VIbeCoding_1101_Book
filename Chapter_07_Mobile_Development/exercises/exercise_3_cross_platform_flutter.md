# Exercise: Cross-Platform Development with Flutter (2025 Edition)

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">
  <h1>Building Truly Native Cross-Platform Apps with Flutter</h1>
  
  <p><i>"One codebase, multiple platforms, native performance"</i></p>
</div>

<hr/>

## Overview

In this exercise, you'll develop a cross-platform mobile application using Flutter, Google's UI toolkit for building natively compiled applications from a single codebase. You'll learn how to create a visually appealing, high-performance app that runs seamlessly on both iOS and Android while following the latest 2025 best practices. This exercise will demonstrate the power of modern declarative UI frameworks for creating consistent experiences across platforms.

## Learning Objectives

- Set up a Flutter development environment
- Understand Flutter's widget-based architecture
- Implement responsive layouts that adapt to different screen sizes
- Apply Material Design 3 and Cupertino design patterns
- Work with state management in Flutter
- Integrate with device features (camera, sensors, etc.)
- Implement animations and transitions
- Test Flutter applications across platforms
- Package and prepare apps for deployment to app stores

## Prerequisites

- Basic understanding of object-oriented programming
- Familiarity with UI design concepts
- Dart programming language basics (can be learned during the exercise)
- Flutter SDK installed on your computer
- VS Code or Android Studio with Flutter extensions
- Android Studio or Xcode for emulators/simulators

## Project Requirements

### Core Features

1. **Social Media Dashboard App**
   - User authentication (email/password and social sign-in)
   - Feed of posts from various sources
   - Interactive post engagement (likes, comments, shares)
   - User profile customization
   - Dark/light mode support
   - Platform-specific UI adaptations
   - Offline support

2. **Technical Requirements**
   - Clean architecture with separation of concerns
   - State management using a modern approach (Riverpod, Bloc, Redux, etc.)
   - Responsive UI that works on phones and tablets
   - Custom animations and transitions
   - Integration with at least one device feature (camera, location, etc.)
   - Error handling and recovery mechanisms
   - Localization for at least two languages

## Implementation Steps

### Step 1: Set Up Your Development Environment

```bash
# Install Flutter SDK (if not already installed)
# Visit flutter.dev for installation instructions

# Create a new Flutter project
flutter create --platforms=android,ios social_dashboard

# Navigate to project directory
cd social_dashboard

# Run the app on an emulator/simulator to verify setup
flutter run
```

### Step 2: Project Structure

Organize your project with a clean architecture approach:

```
lib/
├── core/                  # Core utilities and common functionality
│   ├── constants/         # App constants
│   ├── errors/            # Error handling
│   ├── network/           # Network services
│   ├── storage/           # Local storage
│   └── utils/             # Utility functions
├── data/                  # Data layer
│   ├── models/            # Data models
│   ├── repositories/      # Repository implementations
│   └── sources/           # Data sources (API, local DB)
├── domain/                # Domain layer
│   ├── entities/          # Business entities
│   ├── repositories/      # Repository interfaces
│   └── usecases/          # Use cases/Interactors
├── presentation/          # UI layer
│   ├── common/            # Common UI components
│   ├── features/          # Feature-specific screens and widgets
│   │   ├── auth/          # Authentication screens
│   │   ├── feed/          # Feed screens
│   │   ├── profile/       # Profile screens
│   │   └── settings/      # Settings screens
│   ├── navigation/        # Navigation logic
│   ├── state/             # State management
│   └── themes/            # App themes
└── main.dart              # App entry point
```

### Step 3: Implementing the Basics

Start with the app entry point and theme configuration:

```dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:social_dashboard/presentation/navigation/app_router.dart';
import 'package:social_dashboard/presentation/themes/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services here
  
  runApp(
    const ProviderScope(
      child: SocialDashboardApp(),
    ),
  );
}

class SocialDashboardApp extends ConsumerWidget {
  const SocialDashboardApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final appRouter = ref.watch(appRouterProvider);
    
    return MaterialApp.router(
      title: 'Social Dashboard',
      themeMode: themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
```

### Step 4: Create the App Theme

Implement a modern theme with Material 3 support:

```dart
// lib/presentation/themes/app_theme.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

class AppTheme {
  static final ColorScheme _lightColorScheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF6750A4),
    brightness: Brightness.light,
  );

  static final ColorScheme _darkColorScheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF6750A4),
    brightness: Brightness.dark,
  );

  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: _lightColorScheme,
    appBarTheme: AppBarTheme(
      backgroundColor: _lightColorScheme.surfaceVariant,
      foregroundColor: _lightColorScheme.onSurfaceVariant,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: _lightColorScheme.surfaceVariant.withOpacity(0.5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: _lightColorScheme.primary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
    ),
  );

  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: _darkColorScheme,
    appBarTheme: AppBarTheme(
      backgroundColor: _darkColorScheme.surfaceVariant,
      foregroundColor: _darkColorScheme.onSurfaceVariant,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: _darkColorScheme.surfaceVariant.withOpacity(0.5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: _darkColorScheme.primary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
    ),
  );
}
```

### Step 5: Create a Post Model

```dart
// lib/data/models/post_model.dart

import 'package:freezed_annotation/freezed_annotation.dart';

part 'post_model.freezed.dart';
part 'post_model.g.dart';

@freezed
class Post with _$Post {
  const factory Post({
    required String id,
    required String userId,
    required String userName,
    required String userAvatar,
    required String content,
    String? imageUrl,
    required DateTime createdAt,
    required int likeCount,
    required int commentCount,
    required int shareCount,
    required bool isLiked,
    String? source, // social platform source
  }) = _Post;

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
}
```

### Step 6: Create the Feed Screen

```dart
// lib/presentation/features/feed/feed_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:social_dashboard/data/models/post_model.dart';
import 'package:social_dashboard/presentation/features/feed/post_card.dart';
import 'package:social_dashboard/presentation/features/feed/providers/feed_provider.dart';
import 'package:social_dashboard/presentation/common/app_loading_indicator.dart';
import 'package:social_dashboard/presentation/common/error_view.dart';

class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  final ScrollController _scrollController = ScrollController();
  
  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    
    // Load initial feed data
    Future.microtask(() => ref.read(feedProvider.notifier).loadFeed());
  }
  
  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }
  
  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(feedProvider.notifier).loadMorePosts();
    }
  }
  
  Future<void> _refreshFeed() async {
    await ref.read(feedProvider.notifier).refreshFeed();
  }

  @override
  Widget build(BuildContext context) {
    final feedState = ref.watch(feedProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Social Feed'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
            },
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Navigate to search screen
            },
          ),
        ],
      ),
      body: feedState.when(
        loading: () => const Center(child: AppLoadingIndicator()),
        error: (error, stackTrace) => ErrorView(
          message: error.toString(),
          onRetry: _refreshFeed,
        ),
        data: (posts) => RefreshIndicator(
          onRefresh: _refreshFeed,
          child: posts.isEmpty
              ? const Center(
                  child: Text(
                    'No posts to show',
                    style: TextStyle(fontSize: 18),
                  ),
                )
              : ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 16,
                  ),
                  itemCount: posts.length + (feedState.isLoadingMore ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == posts.length) {
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.all(16.0),
                          child: CircularProgressIndicator(),
                        ),
                      );
                    }
                    
                    final post = posts[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: PostCard(
                        post: post,
                        onLike: () => ref.read(feedProvider.notifier).toggleLike(post.id),
                        onComment: () {
                          // Navigate to comments
                        },
                        onShare: () {
                          // Show share options
                        },
                      ),
                    );
                  },
                ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create post screen
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### Step 7: Create the Post Card Widget

```dart
// lib/presentation/features/feed/post_card.dart

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'package:social_dashboard/data/models/post_model.dart';
import 'package:flutter/cupertino.dart';
import 'dart:io';

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback onLike;
  final VoidCallback onComment;
  final VoidCallback onShare;

  const PostCard({
    Key? key,
    required this.post,
    required this.onLike,
    required this.onComment,
    required this.onShare,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isIOS = Platform.isIOS;
    
    // Platform-specific icons
    final likeIcon = isIOS
        ? post.isLiked
            ? CupertinoIcons.heart_fill
            : CupertinoIcons.heart
        : post.isLiked
            ? Icons.favorite
            : Icons.favorite_border;
    
    final commentIcon = isIOS
        ? CupertinoIcons.chat_bubble
        : Icons.chat_bubble_outline;
    
    final shareIcon = isIOS
        ? CupertinoIcons.share
        : Icons.share;
    
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with avatar and user info
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: CachedNetworkImageProvider(post.userAvatar),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.userName,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Row(
                        children: [
                          Text(
                            timeago.format(post.createdAt),
                            style: theme.textTheme.bodySmall,
                          ),
                          if (post.source != null) ...[
                            const SizedBox(width: 4),
                            const Text('•'),
                            const SizedBox(width: 4),
                            Text(
                              'via ${post.source}',
                              style: theme.textTheme.bodySmall,
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.more_horiz),
                  onPressed: () {
                    // Show options
                  },
                ),
              ],
            ),
          ),
          
          // Post content
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              post.content,
              style: theme.textTheme.bodyMedium,
            ),
          ),
          
          // Post image if available
          if (post.imageUrl != null)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: CachedNetworkImage(
                imageUrl: post.imageUrl!,
                fit: BoxFit.cover,
                width: double.infinity,
                height: 200,
                placeholder: (context, url) => const Center(
                  child: CircularProgressIndicator(),
                ),
                errorWidget: (context, url, error) => const Center(
                  child: Icon(Icons.error),
                ),
              ),
            ),
          
          // Engagement stats
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Text(
                  '${post.likeCount} likes',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(width: 8),
                Text(
                  '${post.commentCount} comments',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(width: 8),
                Text(
                  '${post.shareCount} shares',
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
          ),
          
          // Divider
          const Divider(height: 1),
          
          // Action buttons
          Row(
            children: [
              Expanded(
                child: TextButton.icon(
                  onPressed: onLike,
                  icon: Icon(
                    likeIcon,
                    color: post.isLiked
                        ? theme.colorScheme.primary
                        : theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                  label: Text(
                    'Like',
                    style: TextStyle(
                      color: post.isLiked
                          ? theme.colorScheme.primary
                          : theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: TextButton.icon(
                  onPressed: onComment,
                  icon: Icon(
                    commentIcon,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                  label: Text(
                    'Comment',
                    style: TextStyle(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: TextButton.icon(
                  onPressed: onShare,
                  icon: Icon(
                    shareIcon,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                  label: Text(
                    'Share',
                    style: TextStyle(
                      color: theme.colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
```

## Platform-Specific Considerations

In a cross-platform app, it's important to respect platform conventions while maintaining a consistent brand experience. Here are key considerations:

### 1. Navigation Patterns

- **iOS**: Use iOS-specific navigation patterns with `CupertinoNavigationBar` and slide transitions
- **Android**: Implement Material Design navigation with drawer, bottom navigation, and appropriate transitions

Example of platform-adaptive navigation:

```dart
// lib/presentation/common/platform_aware_scaffold.dart

import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:io';

class PlatformAwareScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final Widget? bottomNavigationBar;
  final Widget? drawer;

  const PlatformAwareScaffold({
    Key? key,
    required this.title,
    required this.body,
    this.actions,
    this.floatingActionButton,
    this.bottomNavigationBar,
    this.drawer,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(
          middle: Text(title),
          trailing: actions != null && actions!.isNotEmpty
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: actions!,
                )
              : null,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Expanded(child: body),
              if (bottomNavigationBar != null) bottomNavigationBar!,
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: actions,
      ),
      body: body,
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: bottomNavigationBar,
      drawer: drawer,
    );
  }
}
```

### 2. UI Components

- Use platform-specific UI components where appropriate
- Implement consistent styling but respect platform conventions

### 3. Gestures and Interactions

- Consider different gesture expectations between platforms
- Implement appropriate feedback mechanisms (e.g., haptics, animations)

### 4. Testing Across Platforms

- Test extensively on both iOS and Android
- Consider edge cases specific to each platform

## Expansion Ideas

Once you've completed the core functionality, consider these enhancements:

1. **Desktop and Web Support**
   - Extend your app to work on desktop platforms and web
   - Implement responsive layouts for larger screens

2. **Advanced Animations**
   - Add hero transitions between screens
   - Implement custom animated UI elements
   - Create engaging micro-interactions

3. **Advanced State Management**
   - Implement a comprehensive state management approach
   - Add support for undo/redo operations

4. **Accessibility Features**
   - Ensure the app works well with screen readers
   - Implement dynamic text sizes
   - Support high-contrast mode

5. **Integration with Platform Features**
   - Add support for biometric authentication
   - Implement app shortcuts
   - Utilize platform-specific capabilities

## Submission Guidelines

For this exercise, create a GitHub repository with your implementation and submit the link. Include:

1. Complete source code
2. A README with:
   - Setup instructions
   - App features
   - Architecture overview
   - Screenshots of the app running on both iOS and Android
3. A brief discussion of:
   - Cross-platform challenges you faced
   - How you balanced platform-specific considerations with code reuse
   - Performance optimizations implemented

## Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter Cookbook](https://flutter.dev/docs/cookbook)
- [Material Design Guidelines](https://material.io/design)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Flutter Riverpod Documentation](https://riverpod.dev/)
- [Flutter Community Packages](https://pub.dev)

---

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
