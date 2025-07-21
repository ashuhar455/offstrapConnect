import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
} from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Dashboard = () => {
  // Removed the unused isExpanded state variable
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(0);
  
  // Debug: Monitor state changes
  useEffect(() => {
    console.log('🔄 STATE CHANGED: isExpanded =', isExpanded);
  }, [isExpanded]);
  
  // Calculate heights
  const collapsedHeight = screenHeight * 0.3; // 30%
  const expandedHeight = screenHeight * 0.5;  // 50%
  const dragThreshold = 50; // Minimum drag distance to trigger expand/collapse

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: (evt, gestureState) => {
        lastGesture.current = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        lastGesture.current = gestureState.dy;
        
        // Allow more natural drag movement
        let newValue = gestureState.dy;
        
        // Less restrictive limits to allow proper gesture detection
        if (newValue > 150) newValue = 150; // Allow more downward drag
        if (newValue < -150) newValue = -150; // Allow more upward drag
        
        translateY.setValue(newValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState; // vy is velocity
        
        console.log('=== GESTURE DEBUG ===');
        console.log('Raw gesture values:', { dy, vy });
        
        // Get current state using a callback to avoid closure issues
        setIsExpanded(currentExpanded => {
          console.log('Current state in callback:', { currentExpanded });
          console.log('Drag threshold:', dragThreshold);
          
          // More lenient thresholds for testing
          const draggedUp = dy < -30; // Dragged up at least 30px
          const swipedUp = vy < -0.2; // Quick upward swipe
          const draggedDown = dy > 30; // Dragged down at least 30px  
          const swipedDown = vy > 0.2; // Quick downward swipe
          
          console.log('Gesture direction checks:', {
            draggedUp: draggedUp,
            swipedUp: swipedUp,
            draggedDown: draggedDown,
            swipedDown: swipedDown
          });
          
          // Simple logic: 
          // - If collapsed and dragged/swiped UP → expand
          // - If expanded and dragged/swiped DOWN → collapse
          const shouldExpand = !currentExpanded && (draggedUp || swipedUp);
          const shouldCollapse = currentExpanded && (draggedDown || swipedDown);
          
          console.log('Final decision:', {
            shouldExpand: shouldExpand,
            shouldCollapse: shouldCollapse,
            reason: shouldExpand ? 'expanding' : shouldCollapse ? 'collapsing' : 'no change'
          });
          
          if (shouldExpand) {
            console.log('EXECUTING: Expand');
            return true; // Set to expanded
          } else if (shouldCollapse) {
            console.log('EXECUTING: Collapse');
            return false; // Set to collapsed
          } else {
            console.log('NO ACTION: Gesture too small');
            return currentExpanded; // Keep current state
          }
        });
        
        console.log('==================');
        
        // Reset animation
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
      onPanResponderTerminate: () => {
        // Reset if gesture is interrupted
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const animatedHeight = translateY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [
      isExpanded ? expandedHeight + 50 : collapsedHeight + 50,
      isExpanded ? expandedHeight : collapsedHeight,
      isExpanded ? expandedHeight - 50 : collapsedHeight - 50,
    ],
    extrapolate: 'clamp',
  });

  const Button = ({ title, onPress, style = {} }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Map View</Text>
          <Text style={styles.mapSubtext}>Google Maps / MapBox would go here</Text>
          <View style={styles.mapFeatures}>
            <Text style={styles.featureText}>📍 Current Location</Text>
            <Text style={styles.featureText}>🔍 Search Places</Text>
            <Text style={styles.featureText}>🚗 Directions</Text>
          </View>
        </View>
      </View>

      {/* Pullable Tab */}
      <Animated.View 
        style={[styles.tabContainer, { height: animatedHeight }]}
        {...panResponder.panHandlers}
      >
        {/* Pull Indicator */}
        <View style={styles.pullIndicatorContainer}>
          <View style={styles.pullIndicator} />
          <Text style={styles.pullHint}>
            {isExpanded ? '⬇️ Pull down to collapse' : '⬆️ Pull up for more options'}
          </Text>
          <Text style={styles.statusText}>
            Status: {isExpanded ? 'Expanded (50%)' : 'Collapsed (30%)'}
          </Text>
          {/* Debug button */}
          <TouchableOpacity 
            style={{backgroundColor: '#ff0000', padding: 8, borderRadius: 4, marginTop: 5}}
            onPress={() => {
              console.log('Manual toggle - current state:', isExpanded);
              setIsExpanded(!isExpanded);
            }}
          >
            <Text style={{color: 'white', fontSize: 10}}>
              DEBUG: Toggle ({isExpanded ? 'Collapse' : 'Expand'})
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* Always visible content - Row 1 (2 buttons) */}
          <View style={styles.row}>
            <Button 
              title="🔍 Search" 
              onPress={() => console.log('Search pressed')}
            //   style={styles.primaryButton}
            />
            <Button 
              title="⚙️ Filter" 
              onPress={() => console.log('Filter pressed')}
            //   style={styles.primaryButton}
            />
          </View>

          {/* Always visible content - Row 2 (3 buttons) */}
          <View style={styles.row}>
            <Button 
              title="📍 Nearby" 
              onPress={() => console.log('Nearby pressed')}
            //   style={styles.secondaryButton}
            />
            <Button 
              title="⭐ Popular" 
              onPress={() => console.log('Popular pressed')}
            //   style={styles.secondaryButton}
            />
            <Button 
              title="💾 Saved" 
              onPress={() => console.log('Saved pressed')}
            //   style={styles.secondaryButton}
            />
          </View>

          {/* Expanded content - Additional buttons that appear on pull up */}
          {isExpanded && (
            <Animated.View 
              style={styles.expandedContent}
            //   entering={{ opacity: 0 }}
            >
              <View style={styles.row}>
                <Button 
                  title="📂 Categories" 
                  onPress={() => console.log('Categories pressed')}
                  style={styles.expandedButton}
                />
                <Button 
                  title="⭐ Reviews" 
                  onPress={() => console.log('Reviews pressed')}
                  style={styles.expandedButton}
                />
              </View>
              
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mapContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
  },
  mapFeatures: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  pullIndicatorContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  pullIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 5,
  },
  pullHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    flex: 0.48,
  },
  secondaryButton: {
    backgroundColor: '#FF9800',
    flex: 0.3,
  },
  expandedButton: {
    backgroundColor: '#9C27B0',
    flex: 0.48,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  expandedContent: {
    marginTop: 10,
  },
  additionalInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default Dashboard;