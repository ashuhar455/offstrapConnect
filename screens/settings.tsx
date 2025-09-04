import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { BleManager, Device, State } from 'react-native-ble-plx';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function SettingsScreen({navigation}) {
  const [travelMode, setTravelMode] = useState(false);
  const [lostMode, setLostMode] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  
  // BLE States
  const [bleManager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [bleState, setBleState] = useState(State.Unknown);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

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
    setConnectionStatus("Scanning...");

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setIsScanning(false);
        setConnectionStatus("Scan Error");
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
          setConnectionStatus("Device Not Found");
        }
      }
    }, 30000);
  };

  const connectToDevice = async (device) => {
    try {
      setConnectionStatus("Connecting...");
      
      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);
      setConnectionStatus("Connected");
      
      console.log('Connected to device:', connectedDevice.name);

      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      // Setup disconnect listener
      connectedDevice.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.name);
        setConnectedDevice(null);
        setConnectionStatus("Disconnected");
      });

      // Setup notification listener
      setupNotifications(connectedDevice);

    } catch (error) {
      console.log('Connection error:', error);
      setConnectionStatus("Connection Failed");
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
      case 'lost_mode_on':
        setLostMode(true);
        Alert.alert('Lost Mode', 'Lost mode has been activated on your bag.');
        break;
      case 'lost_mode_off':
        setLostMode(false);
        Alert.alert('Lost Mode', 'Lost mode has been deactivated on your bag.');
        break;
      case 'travel_mode_on':
        setTravelMode(true);
        break;
      case 'travel_mode_off':
        setTravelMode(false);
        break;
      case 'fingerprint_started':
        Alert.alert('Fingerprint', 'Fingerprint enrollment has started on your bag.');
        break;
      default:
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
        setConnectionStatus("Disconnected");
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  // Handle Lost Mode toggle
  const handleLostModeChange = async (value) => {
    setLostMode(value);
    
    if (value) {
      // Send "lost" command when lost mode is enabled
      await sendBleCommand('lost');
      Alert.alert(
        'Lost Mode Activated',
        'Your bag is now in lost mode. You will be notified if someone tries to access it.',
        [{ text: 'OK' }]
      );
    } else {
      // Send command to disable lost mode
      await sendBleCommand('lost_off');
      Alert.alert(
        'Lost Mode Deactivated',
        'Lost mode has been turned off.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle Travel Mode toggle
  const handleTravelModeChange = async (value) => {
    setTravelMode(value);
    
    if (value) {
      await sendBleCommand('travel_on');
    } else {
      await sendBleCommand('travel_off');
    }
  };

  // Handle Fingerprint Manager
  const handleFingerprintManager = async () => {
    // Send "startFinger" command
    await sendBleCommand('startFinger');
    
    Alert.alert(
      'Fingerprint Enrollment',
      'Fingerprint enrollment has been initiated. Please follow the instructions on your bag.',
      [
        {
          text: 'Continue to Settings',
          onPress: () => navigation.navigate("FPEnroll")
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]
    );
  };

  useEffect(() => {
    // Initialize BLE when component mounts
    const initializeBle = async () => {
      // Monitor Bluetooth state changes
      const subscription = bleManager.onStateChange((state) => {
        setBleState(state);
        if (state === State.PoweredOn && !connectedDevice) {
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

  return (
    <SafeAreaProvider>
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      
      <TouchableOpacity style={styles.bagInfoCard} onPress={() => { }}>
        <View style={styles.bagIconContainer}>
          <View style={styles.bagIconHolder}>
            <Image source={require("../assets/bagorange.png")} style={styles.bagIcon} />
          </View>
        </View>
        <View style={styles.bagInfoTextContainer}>
          <Text style={styles.bagInfoCenterTitle}>John's OFFSTRAP Trail 1.0</Text>
          <Text style={styles.connectionStatusText}>BLE: {connectionStatus}</Text>
        </View>
      </TouchableOpacity> 
      
      <View style={styles.section}>
        <SettingItem icon={require("../assets/account.png")} label="Account" onPress={() => {navigation.navigate("Account")}}/>
        <SettingItem icon={require("../assets/bagname.png")} label="Bag Name" onPress={() => {navigation.navigate("Account")}} />
        <SettingItem icon={require("../assets/appsecurity.png")} label="App Security" onPress={() => {navigation.navigate("Security")}}/>
      </View>

      <View style={styles.section}>
        <SettingItem icon={require("../assets/statistics.png")} label="Usage Chart" onPress={()=> {navigation.navigate("Usage")}} />

        <SettingSwitch
          icon={require("../assets/travel.png")}
          label="Travel Mode"
          value={travelMode}
          onValueChange={handleTravelModeChange}
        />
        <SettingSwitch
          icon={require("../assets/lost.png")}
          label="Lost Mode"
          value={lostMode}
          onValueChange={handleLostModeChange}
        />
      </View>

      <View style={styles.section}>
        <SettingItem icon={require("../assets/display.png")} label="Smart Display" onPress={()=>{navigation.navigate("SmartDisplay")}}/>
        <SettingItem icon={require("../assets/notification.png")} label="Notification" onPress={()=> {navigation.navigate("Notifications")}} />
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={handleFingerprintManager}>
          <Image source={require("../assets/fingerprint.png")} style={styles.icon} />
          <Text style={styles.label}>Fingerprint Manager</Text>
        </TouchableOpacity>

        <SettingItem icon={require("../assets/about.png")} label="About" onPress={()=> {navigation.navigate("About")}}/>
        <SettingItem icon={require("../assets/logout.png")} label="Logout" onPress={() => {handleSignOut(navigation)}} />
      </View>

      {/* BLE Connection Controls */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.item} 
          onPress={connectedDevice ? disconnectDevice : scanForDevices}
        >
          <Image source={require("../assets/bluetooth.png")} style={styles.icon} />
          <Text style={styles.label}>
            {connectedDevice ? 'Disconnect Bag' : 'Connect to Bag'}
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
    </SafeAreaProvider>
  );
}

const handleSignOut = (navigation) => {
  Alert.alert(
    'Confirm Sign Out',
    'Are you sure you want to sign out?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          // Clear any session/token here if needed
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]
  );
};

function SettingItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

function SettingSwitch({ label, value, onValueChange, icon }) {
  return (
    <View style={styles.item}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#444', true: '#007AFF' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 34,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "right"
  },
  profileContainer: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 16,
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
    marginBottom: verticalScale(16),
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
  connectionStatusText: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: 4,
  },
  bagConnectionText: {
    fontSize: moderateScale(16),
    color: 'black',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
    height: 17,
    width: 17,
  },
  label: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
});