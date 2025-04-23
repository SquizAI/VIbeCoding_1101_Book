/**
 * Responsive UI Patterns for React Native (2025 Edition)
 * 
 * This example demonstrates modern best practices for creating responsive
 * user interfaces in React Native that adapt to different screen sizes,
 * device capabilities, and form factors including foldables and tablets.
 * 
 * © 2025 VibeCoding - Where Human Creativity Meets AI Capabilities
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
  PixelRatio,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import { useDynamicBreakpoints } from '@react-native-nexus/responsive';
import { useDeviceContext } from '@react-native-nexus/device-context';

// --------------------------------------------------------------------------
// Responsive Scaling Utilities
// --------------------------------------------------------------------------

/**
 * Modern responsive scaling system that accounts for:
 * - Device pixel density
 * - User font size preferences
 * - Device form factor (phone, tablet, foldable)
 */

// Base dimensions for different device categories
const BASE_DIMENSIONS = {
  phone: { width: 375, height: 812 }, // iPhone 13/14
  tablet: { width: 834, height: 1194 }, // iPad Air
  foldable: { width: 884, height: 1812 }, // Galaxy Z Fold
};

/**
 * Scale a value based on screen width relative to a standard screen width
 * This helps maintain proportional sizing across different device sizes
 */
const scale = (size, formFactor = 'phone') => {
  const { width } = useWindowDimensions();
  const baseWidth = BASE_DIMENSIONS[formFactor].width;
  return (width / baseWidth) * size;
};

/**
 * Scale a value for vertical measurements, based on screen height
 */
const verticalScale = (size, formFactor = 'phone') => {
  const { height } = useWindowDimensions();
  const baseHeight = BASE_DIMENSIONS[formFactor].height;
  return (height / baseHeight) * size;
};

/**
 * Scale a value with a factor that moderates the scaling effect
 * This is useful for font sizes and elements that shouldn't scale linearly
 */
const moderateScale = (size, factor = 0.5, formFactor = 'phone') => {
  const scaledSize = scale(size, formFactor);
  return size + (scaledSize - size) * factor;
};

/**
 * Typography scaling that respects user's system font size settings
 */
const fontScale = (size) => {
  const { fontScale } = useWindowDimensions();
  return size * fontScale;
};

// --------------------------------------------------------------------------
// Responsive Layout Components
// --------------------------------------------------------------------------

/**
 * Responsive Grid that adapts columns based on screen size
 */
const ResponsiveGrid = ({ children, minChildWidth = 150, spacing = 10 }) => {
  const { width } = useWindowDimensions();
  const { breakpoint } = useDynamicBreakpoints();
  
  // Determine number of columns based on breakpoint
  const getColumnCount = useCallback(() => {
    switch (breakpoint) {
      case 'xs': return 1;
      case 'sm': return 2;
      case 'md': return 3;
      case 'lg': return 4;
      case 'xl': return 6;
      default: return Math.max(1, Math.floor(width / minChildWidth));
    }
  }, [breakpoint, width, minChildWidth]);
  
  const columnCount = getColumnCount();
  
  return (
    <View style={styles.gridContainer}>
      {React.Children.map(children, (child, index) => (
        <View 
          style={[
            styles.gridItem, 
            { 
              width: `${100 / columnCount}%`,
              padding: spacing / 2,
            }
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

/**
 * Adaptive layout that changes between row and column based on screen width
 */
const AdaptiveLayout = ({ 
  children, 
  breakpoint = 600, 
  rowProps = {}, 
  columnProps = {} 
}) => {
  const { width } = useWindowDimensions();
  const isRow = width >= breakpoint;
  
  return (
    <View style={[
      isRow ? styles.row : styles.column,
      isRow ? rowProps.style : columnProps.style
    ]}>
      {children}
    </View>
  );
};

/**
 * Component that adapts content based on device type
 */
const DeviceTypeLayout = ({ 
  phoneContent, 
  tabletContent, 
  foldableContent 
}) => {
  const { deviceType, isFolded } = useDeviceContext();
  
  if (deviceType === 'foldable') {
    return foldableContent || tabletContent || phoneContent;
  }
  
  if (deviceType === 'tablet') {
    return tabletContent || phoneContent;
  }
  
  return phoneContent;
};

/**
 * Layout component that adapts to foldable devices
 */
const FoldableLayout = ({ 
  leftContent, 
  rightContent, 
  foldedContent,
  leftWidth = '40%',
  rightWidth = '60%'
}) => {
  const { deviceType, isFolded, foldPosition } = useDeviceContext();
  
  if (deviceType !== 'foldable' || isFolded) {
    return foldedContent;
  }
  
  return (
    <View style={styles.foldableContainer}>
      <View style={[styles.foldableLeft, { width: leftWidth }]}>
        {leftContent}
      </View>
      <View style={styles.foldLine} />
      <View style={[styles.foldableRight, { width: rightWidth }]}>
        {rightContent}
      </View>
    </View>
  );
};

// --------------------------------------------------------------------------
// Example Screen Implementation
// --------------------------------------------------------------------------

export const ResponsiveScreen = () => {
  const { height, width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { deviceType, isFolded } = useDeviceContext();
  
  // Detect orientation
  const isLandscape = width > height;
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'}
      />
      
      <Text style={[
        styles.header, 
        isDarkMode ? styles.darkText : styles.lightText
      ]}>
        Responsive UI Demo (2025)
      </Text>
      
      <View style={styles.infoContainer}>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Device: {Platform.OS} {Platform.Version}
        </Text>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Dimensions: {width.toFixed(0)} × {height.toFixed(0)}
        </Text>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Type: {deviceType} {isFolded ? '(Folded)' : ''}
        </Text>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Orientation: {isLandscape ? 'Landscape' : 'Portrait'}
        </Text>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Pixel Ratio: {PixelRatio.get()}
        </Text>
        <Text style={[
          styles.infoText,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>
          Font Scale: {PixelRatio.getFontScale()}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Adaptive layout example */}
        <View style={styles.sectionContainer}>
          <Text style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>
            Adaptive Layout
          </Text>
          
          <AdaptiveLayout breakpoint={500}>
            <View style={[
              styles.adaptiveBox, 
              { backgroundColor: '#5E72E4' }
            ]}>
              <Text style={styles.boxText}>1</Text>
            </View>
            <View style={[
              styles.adaptiveBox,
              { backgroundColor: '#11CDEF' }
            ]}>
              <Text style={styles.boxText}>2</Text>
            </View>
            <View style={[
              styles.adaptiveBox,
              { backgroundColor: '#2DCE89' }
            ]}>
              <Text style={styles.boxText}>3</Text>
            </View>
          </AdaptiveLayout>
        </View>
        
        {/* Responsive grid example */}
        <View style={styles.sectionContainer}>
          <Text style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>
            Responsive Grid
          </Text>
          
          <ResponsiveGrid minChildWidth={100} spacing={8}>
            {Array(9).fill(0).map((_, i) => (
              <View key={i} style={[
                styles.gridBox,
                { backgroundColor: getRandomColor(i) }
              ]}>
                <Text style={styles.boxText}>{i + 1}</Text>
              </View>
            ))}
          </ResponsiveGrid>
        </View>
        
        {/* Device-specific content */}
        <View style={styles.sectionContainer}>
          <Text style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>
            Device-Specific Content
          </Text>
          
          <DeviceTypeLayout
            phoneContent={
              <View style={[styles.deviceTypeBox, { backgroundColor: '#FB6340' }]}>
                <Text style={styles.boxText}>Phone Layout</Text>
                <Text style={styles.subText}>Optimized for smaller screens</Text>
              </View>
            }
            tabletContent={
              <View style={[styles.deviceTypeBox, { backgroundColor: '#F5365C' }]}>
                <Text style={styles.boxText}>Tablet Layout</Text>
                <Text style={styles.subText}>Using multi-column design</Text>
              </View>
            }
            foldableContent={
              <FoldableLayout
                leftContent={
                  <View style={[styles.foldableContent, { backgroundColor: '#8965E0' }]}>
                    <Text style={styles.boxText}>Navigation</Text>
                  </View>
                }
                rightContent={
                  <View style={[styles.foldableContent, { backgroundColor: '#F5365C' }]}>
                    <Text style={styles.boxText}>Content Area</Text>
                  </View>
                }
                foldedContent={
                  <View style={[styles.deviceTypeBox, { backgroundColor: '#FF9F43' }]}>
                    <Text style={styles.boxText}>Folded Layout</Text>
                    <Text style={styles.subText}>Single screen experience</Text>
                  </View>
                }
              />
            }
          />
        </View>
        
        {/* Text scaling example */}
        <View style={styles.sectionContainer}>
          <Text style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>
            Dynamic Typography
          </Text>
          
          <View style={styles.typographyContainer}>
            <Text style={[
              styles.displayText, 
              isDarkMode ? styles.darkText : styles.lightText
            ]}>
              Display
            </Text>
            <Text style={[
              styles.headingText,
              isDarkMode ? styles.darkText : styles.lightText
            ]}>
              Heading Text
            </Text>
            <Text style={[
              styles.subheadingText,
              isDarkMode ? styles.darkText : styles.lightText
            ]}>
              Subheading Text Scales with User Settings
            </Text>
            <Text style={[
              styles.bodyText,
              isDarkMode ? styles.darkText : styles.lightText
            ]}>
              Body text that scales based on the user's font size preferences set in their device settings. This ensures accessibility for all users, including those who need larger text.
            </Text>
            <Text style={[
              styles.captionText,
              isDarkMode ? styles.darkText : styles.lightText
            ]}>
              Caption text - smallest size that should be used
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to generate colors for the grid example
const getRandomColor = (index) => {
  const colors = [
    '#5E72E4', '#11CDEF', '#2DCE89', '#FB6340', 
    '#F5365C', '#8965E0', '#FCE903', '#FF9F43'
  ];
  return colors[index % colors.length];
};

// --------------------------------------------------------------------------
// Styles
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightText: {
    color: '#333333',
  },
  darkText: {
    color: '#F5F5F5',
  },
  header: {
    fontSize: fontScale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: moderateScale(16),
  },
  infoContainer: {
    padding: moderateScale(16),
    marginHorizontal: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: moderateScale(8),
  },
  infoText: {
    fontSize: fontScale(14),
    marginBottom: verticalScale(4),
  },
  scrollContent: {
    padding: moderateScale(16),
  },
  sectionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  adaptiveBox: {
    flex: 1,
    height: verticalScale(80),
    margin: moderateScale(4),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -moderateScale(4),
  },
  gridItem: {
    paddingVertical: moderateScale(4),
  },
  gridBox: {
    aspectRatio: 1,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTypeBox: {
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(120),
  },
  foldableContainer: {
    flexDirection: 'row',
    height: verticalScale(200),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  foldableLeft: {
    height: '100%',
  },
  foldableRight: {
    height: '100%',
  },
  foldLine: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  foldableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: 'white',
    fontSize: fontScale(18),
    fontWeight: 'bold',
  },
  subText: {
    color: 'white',
    fontSize: fontScale(12),
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  typographyContainer: {
    padding: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: moderateScale(8),
  },
  displayText: {
    fontSize: fontScale(36),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  headingText: {
    fontSize: fontScale(24),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  subheadingText: {
    fontSize: fontScale(18),
    fontWeight: '500',
    marginBottom: verticalScale(8),
  },
  bodyText: {
    fontSize: fontScale(16),
    lineHeight: fontScale(22),
    marginBottom: verticalScale(8),
  },
  captionText: {
    fontSize: fontScale(12),
    opacity: 0.8,
  },
});

export default ResponsiveScreen;
