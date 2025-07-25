import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionType, setConnectionType] = useState("Bluetooth");
  const [bagName, setBagName] = useState("New Offstrap Bag");
  const [networkType, setNetworkType] = useState("4G");
  const [batteryStatus, setBatteryStatus] = useState("100% ~ 24D");
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(0);

  // Sample bag location (you can replace with actual coordinates)
  const [bagLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [mapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Calculate heights
  const collapsedHeight = screenHeight * 0.35; // 35%
  const expandedHeight = screenHeight * 0.55;  // 55%

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
        let newValue = gestureState.dy;
        if (newValue > 150) newValue = 150;
        if (newValue < -150) newValue = -150;
        translateY.setValue(newValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;

        setIsExpanded(currentExpanded => {
          const draggedUp = dy < -30;
          const swipedUp = vy < -0.2;
          const draggedDown = dy > 30;  
          const swipedDown = vy > 0.2;

          const shouldExpand = !currentExpanded && (draggedUp || swipedUp);
          const shouldCollapse = currentExpanded && (draggedDown || swipedDown);

          if (shouldExpand) {
            return true;
          } else if (shouldCollapse) {
            return false;
          } else {
            return currentExpanded;
          }
        });

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
      onPanResponderTerminate: () => {
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

  const customMapStyle = [
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OffStrap</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={mapRegion}
          customMapStyle={customMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          pitchEnabled={true}
          rotateEnabled={true}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          {/* Bag Location Marker */}
          <Marker
            coordinate={bagLocation}
            title={bagName}
            description={`${connectionType} Connected`}
            pinColor="#ff6b35"
          >
            <View style={styles.customMarker}>
              <Image 
                source={require("../assets/bagicon.png")} 
                style={styles.markerIcon} 
              />
            </View>
          </Marker>
        </MapView>

        {/* Map Overlay Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton}>
            <Text style={styles.controlButtonText}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <Text style={styles.controlButtonText}>🎯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pullable Bottom Sheet */}
      <Animated.View
        style={[styles.tabContainer, { height: animatedHeight }]}
        {...panResponder.panHandlers}
      >
        {/* Pull Indicator */}
        <View style={styles.pullIndicatorContainer}>
          <View style={styles.pullIndicator} />
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* Bag Info Card */}
          <TouchableOpacity style={styles.bagInfoCard} onPress={() => {}}>
            <View style={{ height: "auto" }}>
              <View style={[
                styles.bagIconStatusRing, 
                { backgroundColor: connectionType === "Bluetooth" || connectionType === "Cloud" ? "#00a819ff" : "#ff0000ff" }
              ]}>
                <View style={styles.bagIconHolder}>
                  <Image source={require("../assets/bagicon.png")} style={styles.bagIcon} />
                </View>
              </View>
            </View> 
            <View style={{ height: "auto", paddingLeft: 10 }}>
              <Text style={styles.bagInfoCenterTitle}>{bagName}</Text>
              <Text style={styles.connectionText}>{connectionType} Connected</Text>
            </View>
          </TouchableOpacity>

          {/* Network and Battery Row */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.primaryButton, styles.leftButton]} 
              onPress={() => {}}>
              <View style={[styles.row, {justifyContent: 'flex-start', paddingVertical: 20}]}>
                <Image source={require("../assets/network.png")} style={styles.primaryButtonIcon} />
                <View style={{ paddingLeft: 10, paddingVertical: 2 }}>
                  <Text style={styles.buttonText}>Network</Text>
                  <Text style={styles.buttonSubText}>{networkType}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.primaryButton, styles.rightButton]}  
              onPress={() => {}}>
              <View style={[styles.row, {justifyContent: 'flex-start', paddingVertical: 20}]}>
                <Image source={require("../assets/battery.png")} style={styles.primaryButtonIcon} />
                <View style={{ paddingLeft: 10, paddingVertical: 2 }}>
                  <Text style={styles.buttonText}>Battery</Text>
                  <Text style={styles.buttonSubText}>{batteryStatus}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton, styles.leftButton]} 
              onPress={() => {}}>
              <Image source={require("../assets/lock.png")} style={[styles.secondaryButtonIcon]} />
              <Text style={[styles.buttonText, {textAlign:"center"}]}>Unlock</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} 
              onPress={() => {}}>
              <Image source={require("../assets/track2.png")} style={[styles.secondaryButtonIcon]} />
              <Text style={[styles.buttonText, {textAlign:"center"}]}>Track</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton, styles.rightButton]} 
              onPress={() => {}}>
              <Image source={require("../assets/protect.png")} style={[styles.secondaryButtonIcon]} />
              <Text style={[styles.buttonText, {textAlign:"center"}]}>Safety</Text>
            </TouchableOpacity>
          </View>

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View style={styles.expandedContent}>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.expandedButton, styles.leftButton]}>
                  <Text style={[styles.buttonText, {color: 'white'}]}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.expandedButton, styles.rightButton]}>
                  <Text style={[styles.buttonText, {color: 'white'}]}>History</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.additionalInfo}>
                <Text style={styles.infoTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity style={styles.quickAction}>
                    <Text style={styles.quickActionText}>Find My Bag</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <Text style={styles.quickActionText}>Share Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <Text style={styles.quickActionText}>Emergency</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <Text style={styles.quickActionText}>Trip Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1000,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 16,
    flexDirection: 'column',
  },
  mapControlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  pullIndicatorContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  pullIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  leftButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightButton: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  primaryButton: {
    width: "49%",
    height: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
  },
  primaryButtonIcon: {
    height: 32,
    width: 32,
    marginRight: 4,
  },
  secondaryButton: {
    width: "32%",
    height: 80,
    flexDirection: 'column',
  },
  secondaryButtonIcon: {
    height: 28,
    width: 28,
    marginBottom: 8,
  },
  expandedButton: {
    backgroundColor: '#007AFF',
    width: "49%",
    height: 50,
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonSubText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bagInfoCard: {
    height: 80,
    width: "100%",
    flexDirection: 'row',
    backgroundColor: "#f8f8f8",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  bagIconHolder: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: "#ffffff",
  },
  bagIconStatusRing: {
    borderRadius: 100,
    padding: 3,
  },
  bagIcon: {
    resizeMode: "contain",
    height: 28,
    width: 28,
  },
  bagInfoCenterTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: '#333',
  },
  connectionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 8,
  },
  additionalInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickActionText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});

export default Dashboard;