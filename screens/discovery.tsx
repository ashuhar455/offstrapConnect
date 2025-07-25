import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
  Image
} from 'react-native';

const BLEDeviceSearchScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const scanAnimation = useRef(new Animated.Value(0)).current;

  // Mock BLE devices for demonstration
  const mockDevices = [
    {
      id: '1',
      name: 'OffStrap Attempt 1',
      type: 'OffStrap Device',
      rssi: -45,
      batteryLevel: 85,
      isConnectable: true,
      lastSeen: new Date(),
    },
    {
      id: '2',
      name: 'OffStrap Mini',
      type: 'OffStrap Device',
      rssi: -62,
      batteryLevel: 92,
      isConnectable: true,
      lastSeen: new Date(Date.now() - 30000),
    },
    {
      id: '5',
      name: 'OffStrap Travel',
      type: 'OffStrap Device',
      rssi: -73,
      batteryLevel: 67,
      isConnectable: true,
      lastSeen: new Date(Date.now() - 120000),
    },
  ];

  useEffect(() => {
    if (isScanning) {
      startScanAnimation();
      // Simulate finding devices over time
      simulateDeviceDiscovery();
    } else {
      stopScanAnimation();
    }
  }, [isScanning]);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopScanAnimation = () => {
    scanAnimation.stopAnimation();
    scanAnimation.setValue(0);
  };

  const simulateDeviceDiscovery = () => {
    setDevices([]);
    let deviceIndex = 0;
    
    const addDevice = () => {
      if (deviceIndex < mockDevices.length && isScanning) {
        setDevices(prev => [...prev, mockDevices[deviceIndex]]);
        deviceIndex++;
        setTimeout(addDevice, Math.random() * 2000 + 500);
      }
    };
    
    setTimeout(addDevice, 1000);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setDevices([]);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleDeviceSelect = (device) => {
    if (!device.isConnectable) {
      Alert.alert('Device Not Compatible', 'This device cannot be connected to OffStrap.');
      return;
    }
    setSelectedDevice(device);
  };

  const handleConnect = async () => {
    if (!selectedDevice) return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      Alert.alert(
        'Connection Successful',
        `Connected to ${selectedDevice.name}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              console.log('Navigate to Dashboard with connected device');
            }
          }
        ]
      );
    }, 3000);
  };

  const handleBack = () => {
    if (isScanning) {
      handleStopScan();
    }
    console.log('Navigate back');
  };

  const getSignalStrength = (rssi) => {
    if (rssi > -50) return 'Excellent';
    if (rssi > -60) return 'Good';
    if (rssi > -70) return 'Fair';
    return 'Weak';
  };

  const getSignalBars = (rssi) => {
    const strength = rssi > -50 ? 4 : rssi > -60 ? 3 : rssi > -70 ? 2 : 1;
    return '●'.repeat(strength) + '○'.repeat(4 - strength);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'OffStrap Device':
        return '🎒';

    }
  };

  const formatTimeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 30) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="white" 
        translucent={false} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Device</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scan Control Section */}
      <View style={styles.scanSection}>
        <View style={styles.scanInfo}>
          <Text style={styles.scanTitle}>Nearby Bluetooth Devices</Text>
          <Text style={styles.scanSubtitle}>
            {isScanning 
              ? 'Searching for OffStrap devices...' 
              : `Found ${devices.filter(d => d.isConnectable).length} OffStrap device${devices.filter(d => d.isConnectable).length !== 1 ? 's' : ''}`
            }
          </Text>
        </View>

        <View style={styles.scanControls}>
          {!isScanning ? (
            <TouchableOpacity style={styles.scanButton} onPress={handleStartScan}>
              <Text style={styles.scanButtonText}>Start Scan</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={handleStopScan}>
              <Text style={styles.stopButtonText}>Stop Scan</Text>
            </TouchableOpacity>
          )}
          
          {isScanning && (
            <Animated.View
              style={[
                styles.scanIndicator,
                {
                  opacity: scanAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [{
                    scale: scanAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  }],
                }
              ]}
            >
              <Text style={styles.scanIndicatorText}>📡</Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Device List */}
      <ScrollView 
        style={styles.deviceList}
        showsVerticalScrollIndicator={false}
      >
        {devices.length === 0 && !isScanning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}></Text>
            <Text style={styles.emptyStateTitle}>No Devices Found</Text>
            <Text style={styles.emptyStateText}>
              Make sure your OffStrap device is turned on and nearby, then tap "Start Scan"
            </Text>
          </View>
        )}

        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceCard,
              selectedDevice?.id === device.id && styles.selectedDevice,
              !device.isConnectable && styles.incompatibleDevice
            ]}
            onPress={() => handleDeviceSelect(device)}
            disabled={isConnecting}
          >
            <View style={styles.deviceInfo}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceIcon}>{getDeviceIcon(device.type)}</Text>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type}</Text>
                </View>
                {device.isConnectable && selectedDevice?.id === device.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>

              <View style={styles.deviceMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Signal</Text>
                  <View style={styles.signalInfo}>
                    <Text style={styles.signalBars}>{getSignalBars(device.rssi)}</Text>
                    <Text style={styles.signalText}>{getSignalStrength(device.rssi)}</Text>
                  </View>
                </View>

                {device.batteryLevel && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Battery</Text>
                    <Text style={styles.metaValue}>{device.batteryLevel}%</Text>
                  </View>
                )}

                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Last Seen</Text>
                  <Text style={styles.metaValue}>{formatTimeSince(device.lastSeen)}</Text>
                </View>
              </View>

              {!device.isConnectable && (
                <Text style={styles.incompatibleText}>Not compatible with OffStrap</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Connect Button */}
      {selectedDevice && (
        <View style={styles.connectSection}>
          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.connectingButton]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <View style={styles.connectingContent}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.connectButtonText}>Connecting...</Text>
              </View>
            ) : (
              <Text style={styles.connectButtonText}>
                Connect to {selectedDevice.name}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: 'black',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  headerSpacer: {
    flex: 1,
  },
  scanSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scanInfo: {
    marginBottom: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  scanControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanButton: {
    backgroundColor: 'black',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  scanIndicator: {
    padding: 12,
  },
  scanIndicatorText: {
    fontSize: 24,
  },
  deviceList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  deviceCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
  },
  selectedDevice: {
    borderColor: 'black',
    backgroundColor: '#fafafa',
  },
  incompatibleDevice: {
    opacity: 0.6,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 2,
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
  },
  selectedIndicator: {
    backgroundColor: 'black',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
  signalInfo: {
    alignItems: 'center',
  },
  signalBars: {
    fontSize: 12,
    color: 'black',
    marginBottom: 2,
  },
  signalText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
  },
  incompatibleText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  connectSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  connectButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectingButton: {
    backgroundColor: '#666',
  },
  connectingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BLEDeviceSearchScreen;