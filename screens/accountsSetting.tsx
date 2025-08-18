import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AccountScreen({ navigation }) {
  const [fullName, setFullName] = useState('John Doe');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('john.doe@example.com');
  const [attachedId, setAttachedId] = useState('Google');

  const handleSave = () => {
    Alert.alert('Success', 'Your account details have been updated!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>Accounts</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter email"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Attached ID</Text>
        <View style={styles.idRow}>
          <Image
            source={
              attachedId === 'Google'
                ? require('../assets/google_logo.png') // your google icon
                : require('../assets/apple_logo.png')  // your apple icon
            }
            style={styles.idIcon}
          />
          <Text style={styles.idText}>{attachedId}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
  },
  idIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  idText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
