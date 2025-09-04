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
  Platform,
  Alert,
  PermissionsAndroid
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import lockAnimation from '../assets/lockLottie.json'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size; // Based on iPhone X width
const verticalScale = (size: number) => (screenHeight / 812) * size; // Based on iPhone X height
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Lottie JSON variable - replace this with your actual Lottie JSON data
const lockLottieJson = lockAnimation;

const Dashboard = ({navigation}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionType, setConnectionType] = useState("Disconnected");
  const [bagName, setBagName] = useState("Ashish's OFFSTRAP Trail 1.0");
  const [networkType, setNetworkType] = useState("4G");
  const [batteryStatus, setBatteryStatus] = useState("100%");
  const [isLocked, setIsLocked] = useState(true); // Track lock state
  const [showTrackOverlay, setShowTrackOverlay] = useState(false);
  
  // BLE States
  const [bleManager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [bleState, setBleState] = useState(State.Unknown);
  
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(0);
  const lockAnimationRef = useRef(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayScale = useRef(new Animated.Value(0.8)).current;

  // Calculate heights responsively
  const collapsedHeight = screenHeight * 0.36; // 35%
  const expandedHeight = screenHeight * 0.58;  // 55%

  // BLE Functions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const permissions = [];
      
      if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      } else {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN
        );
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allPermissionsGranted = permissions.every(
        permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
      );
      
      return allPermissionsGranted;
    }
    return true;
  };

  const checkBluetoothState = async () => {
    const state = await bleManager.state();
    setBleState(state);
    
    if (state === State.PoweredOff) {
      Alert.alert(
        'Bluetooth is Off',
        'Please turn on Bluetooth to connect to your bag.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Refresh',
            onPress: () => checkBluetoothState(),
          },
        ]
      );
      return false;
    } else if (state === State.PoweredOn) {
      return true;
    }
    return false;
  };

  const scanForDevices = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Bluetooth permissions are required to connect to your bag.');
      return;
    }

    const bluetoothReady = await checkBluetoothState();
    if (!bluetoothReady) return;

    setIsScanning(true);
    setConnectionType("Scanning...");

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setIsScanning(false);
        setConnectionType("Scan Error");
        return;
      }

      if (device && device.name && device.name.includes('OFS-A1-')) {
        console.log('Found target device:', device.name);
        bleManager.stopDeviceScan();
        setIsScanning(false);
        connectToDevice(device);
      }
    });

    // Stop scanning after 30 seconds if no device found
    setTimeout(() => {
      if (isScanning) {
        bleManager.stopDeviceScan();
        setIsScanning(false);
        if (!connectedDevice) {
          setConnectionType("Device Not Found");
          Alert.alert(
            'Device Not Found',
            'Could not find a device with OFS-A1- in its name. Make sure your bag is powered on and nearby.',
            [
              {
                text: 'Retry',
                onPress: () => scanForDevices(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }
      }
    }, 30000);
  };

  const connectToDevice = async (device) => {
    try {
      setConnectionType("Connecting...");
      
      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);
      setConnectionType("Connected");
      
      console.log('Connected to device:', connectedDevice.name);

      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      // Setup disconnect listener
      connectedDevice.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.name);
        setConnectedDevice(null);
        setConnectionType("Disconnected");
        
        if (error) {
          console.log('Disconnect error:', error);
          Alert.alert(
            'Connection Lost',
            'Connection to your bag was lost unexpectedly.',
            [
              {
                text: 'Reconnect',
                onPress: () => scanForDevices(),
              },
              {
                text: 'OK',
                style: 'cancel',
              },
            ]
          );
        }
      });

      // Setup notification listener (you'll need to replace with your actual service/characteristic UUIDs)
      setupNotifications(connectedDevice);

    } catch (error) {
      console.log('Connection error:', error);
      setConnectionType("Connection Failed");
      Alert.alert(
        'Connection Failed',
        'Failed to connect to the device. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => connectToDevice(device),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const setupNotifications = async (device) => {
    try {
      // Replace these UUIDs with your actual service and characteristic UUIDs
      const SERVICE_UUID = 'your-service-uuid-here';
      const CHARACTERISTIC_UUID = 'your-characteristic-uuid-here';
      
      // Monitor for notifications/indications
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log('Monitor error:', error);
            return;
          }
          
          if (characteristic && characteristic.value) {
            // Decode the received data
            const receivedData = Buffer.from(characteristic.value, 'base64').toString('utf-8');
            console.log('Received data:', receivedData);
            
            // Handle received data
            handleBleDataReceived(receivedData);
          }
        }
      );
    } catch (error) {
      console.log('Setup notifications error:', error);
    }
  };

  const handleBleDataReceived = (data) => {
    console.log('BLE Data received:', data);
    
    // Handle different types of received data
    switch (data.toLowerCase()) {
      case 'battery_low':
        setBatteryStatus('Low');
        Alert.alert('Low Battery', 'Your bag battery is running low.');
        break;
      case 'unlocked':
        setIsLocked(false);
        break;
      case 'locked':
        setIsLocked(true);
        break;
      case 'track_response':
        // Handle track response
        console.log('Track command acknowledged');
        break;
      default:
        // Handle other data types
        console.log('Unknown data received:', data);
    }
  };

  const sendBleCommand = async (command) => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to your bag first.');
      return;
    }

    try {
      // Replace these UUIDs with your actual service and characteristic UUIDs
      const SERVICE_UUID = 'your-service-uuid-here';
      const CHARACTERISTIC_UUID = 'your-write-characteristic-uuid-here';
      
      // Convert command to base64
      const commandBuffer = Buffer.from(command, 'utf-8');
      const commandBase64 = commandBuffer.toString('base64');
      
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        commandBase64
      );
      
      console.log('Command sent:', command);
    } catch (error) {
      console.log('Send command error:', error);
      Alert.alert('Command Failed', 'Failed to send command to device.');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setConnectionType("Disconnected");
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  // Animation functions
  const toggleLockAnimation = async () => {
    if (lockAnimationRef.current) {
      if (isLocked) {
        // Send unlock command via BLE
        await sendBleCommand('unlock');
        
        // Play forward (unlock)
        lockAnimationRef.current.play(0, 60);
        // Note: Don't set isLocked here, wait for BLE response
      } else {
        // Send lock command via BLE
        await sendBleCommand('lock');
        
        // Play in reverse (lock)
        lockAnimationRef.current.play(60, 0);
        // Note: Don't set isLocked here, wait for BLE response
      }
    }
  };

  // Track button functionality
  const handleTrackPress = async () => {
    // Send track command via BLE
    await sendBleCommand('track');
    
    setShowTrackOverlay(true);
    
    // Animate overlay in
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(overlayScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // Auto fade out after 4 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(overlayScale, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start(() => {
        setShowTrackOverlay(false);
      });
    }, 4000);
  };

  // Settings crash functionality
  const handleSettingsPress = () => {
    // Disconnect BLE before navigating
    disconnectDevice();
  };

  useEffect(() => {
    // Initialize BLE when component mounts
    const initializeBle = async () => {
      // Monitor Bluetooth state changes
      const subscription = bleManager.onStateChange((state) => {
        setBleState(state);
        if (state === State.PoweredOn) {
          scanForDevices();
        }
      }, true);

      return () => subscription.remove();
    };

    initializeBle();

    // Cleanup on unmount
    return () => {
      if (connectedDevice) {
        disconnectDevice();
      }
      bleManager.destroy();
    };
  }, []);

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

  const customMapStyle = [
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Map Background */}
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
          description={`${connectionType}`}
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

      {/* Track Overlay */}
      {showTrackOverlay && (
        <Animated.View 
          style={[
            styles.trackOverlay,
            {
              opacity: overlayOpacity,
              transform: [{ scale: overlayScale }]
            }
          ]}
        >
          <View style={styles.overlayContent}>
            <View style={styles.bleIndicator}>
              <View style={[
                styles.bleIcon, 
                { backgroundColor: connectedDevice ? '#4CAF50' : '#f44336' }
              ]} />
              <Text style={[
                styles.overlayTitle,
                { color: connectedDevice ? '#4CAF50' : '#f44336' }
              ]}>
                {connectedDevice ? 'BLE Connected' : 'BLE Disconnected'}
              </Text>
            </View>
            <Text style={styles.overlayMessage}>
              {connectedDevice ? 'Bag within 5m radius' : 'Searching for bag...'}
            </Text>
            <View style={styles.radiusIndicator}>
              <View style={styles.radiusRing1} />
              <View style={styles.radiusRing2} />
              <View style={styles.radiusCenter} />
            </View>
          </View>
        </Animated.View>
      )}

      {/* Map Overlay Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapControlButton}>
          <Image style={styles.mapButtonIcon} source={require("../assets/mapCenter.png")}></Image>
        </TouchableOpacity>
      </View>

      {/* Pullable Tab */}
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
          <TouchableOpacity style={styles.bagInfoCard} onPress={() => { }}>
            <View style={styles.bagIconContainer}>
              <View style={styles.bagIconHolder}>
                <Image source={require("../assets/bag.jpeg")} style={styles.bagIcon} />
              </View>
            </View>
            <View style={styles.bagInfoTextContainer}>
              <Text style={styles.bagInfoCenterTitle}>{bagName}</Text>

              <View style={[styles.row, { alignItems: "center", height: 20, justifyContent: "flex-start" }]}>
                <Image source={require("../assets/battery.png")} style={styles.batIcon} />
                <Text style={styles.bagConnectionText}>{batteryStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, styles.primaryButtonLeft]}
              onPress={() => { }}
            >
              <View style={styles.primaryButtonContent}>
                <Image source={require("../assets/network.png")} style={styles.primaryButtonIcon} />
                <View style={styles.primaryButtonTextContainer}>
                  <Text style={styles.buttonText}>Network</Text>
                  <Text style={styles.buttonText}>{networkType}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, styles.primaryButtonRight]}
              onPress={connectedDevice ? disconnectDevice : scanForDevices}
            >
              <View style={styles.primaryButtonContent}>
                <Image source={require("../assets/bluetooth.png")} style={styles.primaryButtonIcon} />
                <View style={styles.primaryButtonTextContainer}>
                  <Text style={styles.buttonText}>Bluetooth</Text>
                  <Text style={styles.buttonText}>{connectionType}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Secondary buttons row */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, styles.secondaryButtonLeft]}
              onPress={() => {
                toggleLockAnimation();
              }}
            >
              <LottieView
                ref={lockAnimationRef}
                source={lockLottieJson}
                style={styles.secondaryButtonIcon}
                autoPlay={false}
                loop={false}
                colorFilters={[
                  {
                    keypath: "*",
                    color: "#ffffff"
                  }
                ]}
              />
              <Text style={styles.secondaryButtonText}>
                {isLocked ? "Locked" : "Unlocked"} 
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleTrackPress}
            >
              <Image source={require("../assets/location.png")} style={styles.secondaryButtonIcon} />
              <Text style={styles.secondaryButtonText}>Track</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, styles.secondaryButtonRight]}
              onPress={() => { }}
            >
              <Image source={require("../assets/alarm.png")} style={styles.secondaryButtonIcon} />
              <Text style={styles.secondaryButtonText}>Alarm</Text>
            </TouchableOpacity>
          </View>

          {/* Expanded content */}
          {isExpanded && (
            <Animated.View style={styles.expandedContent}>
              <View>
                <TouchableOpacity
                  style={[styles.button, styles.tertiaryButton]}
                  onPress={() => {navigation.navigate("BagHub")}}
                >
                  <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                    <Image source={require("../assets/bagHub.png")} style={styles.secondaryButtonIcon} />
                    <Text style={[styles.buttonText, { fontSize: 18, paddingLeft: 10 }]}>Bag Hub</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.tertiaryButton]}
                  onPress={()=>{navigation.navigate("Settings")}}
                >
                  <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                    <Image source={require("../assets/settings.png")} style={styles.secondaryButtonIcon} />
                    <Text style={[styles.buttonText, { fontSize: 18, paddingLeft: 10 }]}>Settings</Text>
                  </View>
                </TouchableOpacity>
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
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: 'white',
    padding: moderateScale(8),
    borderRadius: moderateScale(25),
    borderWidth: 2,
    borderColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: 'contain',
  },
  mapControls: {
    position: 'absolute',
    top: verticalScale(430),
    right: scale(16),
    flexDirection: 'column',
  },
  mapButtonIcon: {
    height: verticalScale(25),
    width: scale(25),
    filter: "invert(100%)"
  },
  mapControlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: moderateScale(16),
  },
  // Track Overlay Styles
  trackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: '#1a1919',
    borderRadius: moderateScale(20),
    padding: moderateScale(30),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  bleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
  bleIcon: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: '#4CAF50',
    marginRight: moderateScale(10),
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  overlayTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  overlayMessage: {
    fontSize: moderateScale(16),
    color: 'white',
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  radiusIndicator: {
    width: moderateScale(80),
    height: moderateScale(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusRing1: {
    position: 'absolute',
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: 2,
    borderColor: '#4CAF50',
    opacity: 0.3,
  },
  radiusRing2: {
    position: 'absolute',
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    borderColor: '#4CAF50',
    opacity: 0.6,
  },
  radiusCenter: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0e0e0eff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    elevation: 8,
  },
  pullIndicatorContainer: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(12),
  },
  pullIndicator: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: '#ddd',
    borderRadius: moderateScale(2),
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: scale(15),
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
    marginTop: verticalScale(2),
  },
  button: {
    backgroundColor: '#1a1919ff',
    justifyContent: 'center',
  },
  primaryButton: {
    width: "47.5%",
    height: verticalScale(70),
    justifyContent: "center",
    alignItems: "center"
  },
  primaryButtonLeft: {
    borderTopLeftRadius: moderateScale(12),
    borderBottomLeftRadius: moderateScale(12),
  },
  primaryButtonRight: {
    borderTopRightRadius: moderateScale(12),
    borderBottomRightRadius: moderateScale(12),
  },
  primaryButtonContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: verticalScale(20),
  },
  primaryButtonIcon: {
    marginTop: verticalScale(6),
    height: moderateScale(35),
    width: moderateScale(35),
  },
  primaryButtonTextContainer: {
    paddingLeft: scale(10),
    paddingVertical: verticalScale(2),
  },
  secondaryButton: {
    width: "31%",
    height: verticalScale(85),
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: 12,
  },
  secondaryButtonLeft: {
    borderTopLeftRadius: moderateScale(12),
    borderBottomLeftRadius: moderateScale(12),
  },
  secondaryButtonRight: {
    borderTopRightRadius: moderateScale(12),
    borderBottomRightRadius: moderateScale(12),
  },
  secondaryButtonIcon: {
    height: moderateScale(30),
    width: moderateScale(30),
    alignSelf: "center",
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(15),
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: moderateScale(15),
    textAlign: "center",
    paddingTop: 5
  },
  expandedContent: {
    marginTop: verticalScale(2),
  },
  tertiaryButton: {
    width: "100%",
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(12)
  },
  bagInfoCard: {
    height: verticalScale(80),
    width: "100%",
    flexDirection: 'row',
    backgroundColor: "#ffffffff",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  bagIconContainer: {
    height: "auto",
  },
  bagIconStatusRing: {
    borderRadius: moderateScale(100),
    padding: moderateScale(3),
  },
  bagIconHolder: {
    borderRadius: moderateScale(100),
    padding: moderateScale(8),
    backgroundColor: "#abb4c2ff",
  },
  bagIcon: {
    resizeMode: "contain",
    height: moderateScale(35),
    width: moderateScale(35),
  },
  bagInfoTextContainer: {
    height: "auto",
    paddingLeft: scale(10),
  },
  bagInfoCenterTitle: {
    fontSize: moderateScale(20),
    fontWeight: "500",
    color: 'black',
  },
  bagConnectionText: {
    fontSize: moderateScale(16),
    color: 'black',
    paddingHorizontal: 10,
  },
  batIcon: {
    height: verticalScale(35),
    width: scale(32),
    resizeMode: "contain",
    marginTop: 4,
  }
});

export default Dashboard;