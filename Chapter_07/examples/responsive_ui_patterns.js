/**
 * Responsive UI Patterns for React Native
 * 
 * This example demonstrates best practices for creating responsive
 * user interfaces in React Native that adapt to different screen sizes,
 * orientations, and device capabilities.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  PixelRatio,
} from 'react-native';

// --------------------------------------------------------------------------
// Responsive Scaling Utilities
// --------------------------------------------------------------------------

/**
 * Scale a value based on screen width relative to a standard screen width
 * This helps maintain proportional sizing across different device sizes
 */
const standardScreenWidth = 375; // Base width (iPhone X/11 Pro/12 Mini)

export const scale = (size) => {
  const { width } = Dimensions.get('window');
  return (width / standardScreenWidth) * size;
};

/**
 * Normalize font sizes to look consistent across different device densities
 * This resolves issues with text appearing too small on high-density screens
 */
export const normalizeFont = (size) => {
  const scale = Dimensions.get('window').width / standardScreenWidth;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

/**
 * Calculate responsive spacing values for consistent layouts
 */
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

/**
 * Determine device size category for conditional layouts
 */
export const getDeviceSize = () => {
  const { width } = Dimensions.get('window');
  
  if (width < 375) return 'small'; // Small phones
  if (width < 768) return 'medium'; // Standard phones
  if (width < 1024) return 'large'; // Large phones, small tablets
  return 'xlarge'; // Large tablets, foldables
};

// --------------------------------------------------------------------------
// Responsive Layout Components
// --------------------------------------------------------------------------

/**
 * Responsive Row component that wraps to column on small screens
 */
export const ResponsiveRow = ({ children, breakpoint = 768, style }) => {
  const { width } = useWindowDimensions();
  const isRow = width >= breakpoint;
  
  return (
    <View 
      style={[
        styles.row, 
        !isRow && styles.column,
        style
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Grid component that adjusts columns based on screen width
 */
export const ResponsiveGrid = ({ 
  children, 
  minChildWidth = 150,
  spacing = 8,
  style 
}) => {
  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(1);
  
  useEffect(() => {
    // Calculate how many columns can fit
    const columnsCount = Math.floor(width / minChildWidth);
    setNumColumns(Math.max(1, columnsCount));
  }, [width, minChildWidth]);
  
  // Clone children and wrap them in appropriate containers
  const wrappedChildren = React.Children.map(children, (child, index) => {
    const childStyle = {
      flexBasis: `${100 / numColumns}%`,
      padding: spacing,
    };
    
    return <View style={childStyle}>{child}</View>;
  });
  
  return (
    <View 
      style={[
        styles.grid,
        { margin: -spacing },
        style
      ]}
    >
      {wrappedChildren}
    </View>
  );
};

/**
 * Component that shows different content based on screen size
 */
export const ResponsiveContainer = ({ 
  small, 
  medium, 
  large, 
  xlarge 
}) => {
  const [deviceSize, setDeviceSize] = useState(getDeviceSize());
  const { width } = useWindowDimensions();
  
  useEffect(() => {
    // Update device size when dimensions change
    const onDimensionsChange = () => {
      setDeviceSize(getDeviceSize());
    };
    
    const subscription = Dimensions.addEventListener('change', onDimensionsChange);
    
    return () => {
      // Clean up listener on unmount
      subscription.remove();
    };
  }, []);
  
  // Return appropriate content based on device size
  switch(deviceSize) {
    case 'small':
      return small || medium || large || xlarge;
    case 'medium':
      return medium || small || large || xlarge;
    case 'large':
      return large || medium || xlarge || small;
    case 'xlarge':
      return xlarge || large || medium || small;
    default:
      return medium || small || large || xlarge;
  }
};

// --------------------------------------------------------------------------
// Orientation Handling
// --------------------------------------------------------------------------

/**
 * Hook for responding to orientation changes
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height 
      ? 'landscape' 
      : 'portrait'
  );
  
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    
    const subscription = Dimensions.addEventListener('change', updateOrientation);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  return orientation;
};

/**
 * Component that renders different layouts based on orientation
 */
export const OrientationAwareContainer = ({ portrait, landscape }) => {
  const orientation = useOrientation();
  
  return orientation === 'portrait' ? portrait : landscape;
};

// --------------------------------------------------------------------------
// Device Feature Detection
// --------------------------------------------------------------------------

/**
 * Hook for detecting device capabilities
 */
export const useDeviceCapabilities = () => {
  return {
    hasNotch: Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS,
    isTablet: Platform.isPad || (Platform.OS === 'android' && Dimensions.get('window').width >= 768),
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    majorVersion: parseInt(Platform.Version, 10),
    statusBarHeight: StatusBar.currentHeight || (Platform.OS === 'ios' ? 44 : 0),
  };
};

// --------------------------------------------------------------------------
// Example Usage Demo Component
// --------------------------------------------------------------------------

export const ResponsiveUIDemo = () => {
  const { width, height } = useWindowDimensions();
  const orientation = useOrientation();
  const deviceCapabilities = useDeviceCapabilities();
  const deviceSize = getDeviceSize();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Responsive UI Patterns</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <Text style={styles.text}>Device Size: {deviceSize}</Text>
          <Text style={styles.text}>Screen Width: {width}px</Text>
          <Text style={styles.text}>Screen Height: {height}px</Text>
          <Text style={styles.text}>Orientation: {orientation}</Text>
          <Text style={styles.text}>
            Platform: {Platform.OS} (v{Platform.Version})
          </Text>
          <Text style={styles.text}>
            Has Notch: {deviceCapabilities.hasNotch ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.text}>
            Is Tablet: {deviceCapabilities.isTablet ? 'Yes' : 'No'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsive Row Example</Text>
          <ResponsiveRow breakpoint={500}>
            <View style={[styles.box, { backgroundColor: '#FF5252' }]}>
              <Text style={styles.boxText}>Box 1</Text>
            </View>
            <View style={[styles.box, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.boxText}>Box 2</Text>
            </View>
            <View style={[styles.box, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.boxText}>Box 3</Text>
            </View>
          </ResponsiveRow>
          <Text style={styles.caption}>
            ↑ Changes from row to column layout below 500px width
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsive Grid Example</Text>
          <ResponsiveGrid minChildWidth={120} spacing={8}>
            {Array(6).fill(0).map((_, index) => (
              <View key={index} style={styles.gridItem}>
                <Text style={styles.gridItemText}>Item {index + 1}</Text>
              </View>
            ))}
          </ResponsiveGrid>
          <Text style={styles.caption}>
            ↑ Grid automatically adjusts columns based on available width
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Size Specific Content</Text>
          <ResponsiveContainer
            small={
              <View style={[styles.sizeSpecificBox, { backgroundColor: '#F44336' }]}>
                <Text style={styles.boxText}>Small Device Layout</Text>
                <Text style={styles.smallText}>Optimized for compact screens</Text>
              </View>
            }
            medium={
              <View style={[styles.sizeSpecificBox, { backgroundColor: '#3F51B5' }]}>
                <Text style={styles.boxText}>Medium Device Layout</Text>
                <Text style={styles.smallText}>Standard phone layout</Text>
              </View>
            }
            large={
              <View style={[styles.sizeSpecificBox, { backgroundColor: '#009688' }]}>
                <Text style={styles.boxText}>Large Device Layout</Text>
                <Text style={styles.smallText}>Enhanced for larger phones</Text>
              </View>
            }
            xlarge={
              <View style={[styles.sizeSpecificBox, { backgroundColor: '#673AB7' }]}>
                <Text style={styles.boxText}>Tablet Layout</Text>
                <Text style={styles.smallText}>Multi-column layout for tablets</Text>
              </View>
            }
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orientation Specific Layout</Text>
          <OrientationAwareContainer
            portrait={
              <View style={[styles.orientationBox, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.boxText}>Portrait Layout</Text>
                <Text style={styles.smallText}>Optimized for vertical viewing</Text>
              </View>
            }
            landscape={
              <View style={[styles.orientationBox, { backgroundColor: '#E91E63' }]}>
                <Text style={styles.boxText}>Landscape Layout</Text>
                <Text style={styles.smallText}>
                  Landscape layout provides more horizontal space
                </Text>
              </View>
            }
          />
          <Text style={styles.caption}>
            ↑ Changes based on device orientation
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scale & Spacing Demo</Text>
          <View style={styles.spacingDemo}>
            <View style={[styles.spacingBox, { padding: spacing.xs }]}>
              <Text>xs</Text>
            </View>
            <View style={[styles.spacingBox, { padding: spacing.sm }]}>
              <Text>sm</Text>
            </View>
            <View style={[styles.spacingBox, { padding: spacing.md }]}>
              <Text>md</Text>
            </View>
            <View style={[styles.spacingBox, { padding: spacing.lg }]}>
              <Text>lg</Text>
            </View>
            <View style={[styles.spacingBox, { padding: spacing.xl }]}>
              <Text>xl</Text>
            </View>
          </View>
          <Text style={styles.caption}>
            ↑ Responsive spacing system scales with screen size
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Scaling Demo</Text>
          <View>
            <Text style={[styles.fontDemo, { fontSize: normalizeFont(12) }]}>
              Small Text (12sp)
            </Text>
            <Text style={[styles.fontDemo, { fontSize: normalizeFont(16) }]}>
              Medium Text (16sp)
            </Text>
            <Text style={[styles.fontDemo, { fontSize: normalizeFont(20) }]}>
              Large Text (20sp)
            </Text>
            <Text style={[styles.fontDemo, { fontSize: normalizeFont(24) }]}>
              Heading Text (24sp)
            </Text>
            <Text style={[styles.fontDemo, { fontSize: normalizeFont(32) }]}>
              Title Text (32sp)
            </Text>
          </View>
          <Text style={styles.caption}>
            ↑ Normalized font sizes maintain readability across devices
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --------------------------------------------------------------------------
// Styles
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: normalizeFont(24),
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: normalizeFont(18),
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  text: {
    fontSize: normalizeFont(14),
    marginBottom: spacing.xs,
    color: '#666',
  },
  caption: {
    fontSize: normalizeFont(12),
    fontStyle: 'italic',
    color: '#888',
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
  },
  box: {
    flex: 1,
    minWidth: 100,
    margin: 4,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  boxText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalizeFont(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  gridItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sizeSpecificBox: {
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  orientationBox: {
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  smallText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: normalizeFont(14),
    marginTop: spacing.xs,
  },
  spacingDemo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  spacingBox: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  fontDemo: {
    marginBottom: spacing.sm,
    color: '#333',
  },
});

export default ResponsiveUIDemo;

/**
 * Best Practices Demonstrated:
 * 
 * 1. Responsive Sizing: Using relative units instead of fixed pixel values
 * 2. Screen Size Detection: Adapting layouts based on device size
 * 3. Orientation Handling: Changing layouts when device rotates
 * 4. Device Feature Detection: Adjusting for platform differences
 * 5. Consistent Spacing: Using a scaled spacing system
 * 6. Normalized Typography: Ensuring readable text across devices
 * 7. Flexible Layouts: Components that adapt to available space
 * 8. Adaptive Components: Different content for different contexts
 * 9. Performance Optimization: Efficient re-rendering strategies
 * 10. Cross-Platform Consistency: Working well on both iOS and Android
 */
