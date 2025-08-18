import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select'; // if you plan to use

export default function NotificationSettingsScreen() {
  const [notifyBle, setNotifyBle] = useState(false);
  const [tamperAttempts, setTamperAttempts] = useState('3');
  const [muteDuration, setMuteDuration] = useState('8h');

  const handleAddSafeZone = () => {
    Alert.alert('Safe Zone', 'Add Safe Zone clicked');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Notification Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Notify on BLE disconnect or unsafe zone</Text>
        <Switch
          value={notifyBle}
          onValueChange={setNotifyBle}
          trackColor={{ false: '#444', true: '#007AFF' }}
          thumbColor={notifyBle ? '#fff' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.item} onPress={handleAddSafeZone}>
        <Text style={styles.label}>Add Safe Zone</Text>
        <Text style={styles.link}>➕</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.label}>Tamper Alert</Text>
        {/* Replace with real dropdown if needed */}
        <TouchableOpacity
          onPress={() => {
            const next = tamperAttempts === '3' ? '5' : tamperAttempts === '5' ? '10' : '3';
            setTamperAttempts(next);
          }}
        >
          <Text style={styles.dropdown}>{tamperAttempts} failed attempts</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Mute Notifications</Text>
        {/* Replace with real dropdown if needed */}
        <TouchableOpacity
          onPress={() => {
            const next = muteDuration === '8h' ? '24h' : muteDuration === '24h' ? '1 week' : '8h';
            setMuteDuration(next);
          }}
        >
          <Text style={styles.dropdown}>{muteDuration}</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  link: {
    color: '#00f',
    fontSize: 20,
    paddingHorizontal: 8,
  },
  dropdown: {
    color: '#0af',
    fontSize: 16,
  },
});
