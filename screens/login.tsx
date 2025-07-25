import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


export default function LoginScreen() {
  return (
    <View style={styles.container}>
     <Image
        source={require('assets/offstrap.jpg')} // Replace with your logo path
        style={styles.logo}
        resizeMode="strech"
      />
      <TouchableOpacity style={styles.googleBtn}>
        <Image
          source={require('assets/google_logo.png')}
          style={styles.icon}
        />
        <Text style={styles.btnText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleBtn}>
        <Image
          source={require('assets/apple_logo.png')}
          style={styles.icon}
        />
        <Text style={styles.btnText}>Sign in with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 40,
    color: '#fff',
    letterSpacing: 5,
    fontFamily: 'monospace',
    marginBottom: 60,
  },
    logo: {
    width: 300,
    height: 80,
    marginBottom: 60,
    filter: 'invert(100%)',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  btnText: {
    fontSize: 16,
    color: '#000',
  },
});
