 import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Uncomment and install if you use Expo or React Native CLI with biometric support
// import * as LocalAuthentication from 'expo-local-authentication';

export default function AppSecurityScreen() {
  const [settings, setSettings] = useState({
    appLock: false, 
  });

  const handleToggle = async (key) => {
    const currentValue = settings[key];

    const confirmAction = () => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (key === 'appLock') {
      // Simulated biometric auth — replace this with actual implementation
      Alert.alert('Fingerprint Auth', 'This would trigger phones default authentication. Would You lIke to enable it? ', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => confirmAction(),
        }
      ]);

      // Uncomment below to use real biometric auth
      /*
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Biometric Auth not supported');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable App Lock',
      });

      if (result.success) {
        confirmAction();
      } else {
        Alert.alert('Authentication failed');
      }
      */
    } else {
      Alert.alert(
        'Confirmation',
        `Are you sure you want to ${currentValue ? 'disable' : 'enable'} ${formatLabel(key)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: confirmAction }
        ]
      );
    }
  };

  const formatLabel = (key) => {
    switch (key) {
      case 'appLock': return 'App Lock';
     
      default: return key;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>App Security</Text>

      {Object.keys(settings).map((key) => (
        <View key={key} style={styles.item}>
          <Icon name="shield" size={24} color="white" style={styles.icon} />
          <Text style={styles.label}>{formatLabel(key)}</Text>
          <Switch
            value={settings[key]}
            onValueChange={() => handleToggle(key)}
            trackColor={{ false: '#444', true: '#007AFF' }}
            thumbColor={settings[key] ? '#fff' : '#f4f3f4'}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
});
