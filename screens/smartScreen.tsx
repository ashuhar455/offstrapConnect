import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function SmartDisplayScreen() {
  const [inputText, setInputText] = useState('');
  const [previewText, setPreviewText] = useState('');

  const handleUpdateDisplay = () => {
    setPreviewText(inputText);
    // TODO: Send text to actual E-Ink display using BLE / API / USB comm
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.heading}>Smart E-Ink Display</Text>

      <Text style={styles.label}>Enter Display Text</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your display message here..."
        placeholderTextColor="#555"
        value={inputText}
        onChangeText={setInputText}
        multiline
        maxLength={200}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateDisplay}>
        <Text style={styles.buttonText}>Update Display</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Preview:</Text>
      <View style={styles.previewBox}>
        <Text style={styles.previewText}>
          {previewText || 'Your message will appear here'}
        </Text>
      </View>

      {/* 
        Future enhancements:
        - Use a font similar to your E-Ink device
        - Add QR code support with: react-native-qrcode-svg
        - Add Lottie or loading indicator
        - Add save/clear buttons
      */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  previewBox: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  previewText: {
    color: '#ccc',
    fontSize: 18,
  },
});
