import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    configureGoogleSignIn();
    checkIfUserIsSignedIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '956621936558-vvp26l1vbgq27bnut83lk60kf79825ar.apps.googleusercontent.com', // From Google Console
      offlineAccess: true,
      hostedDomain: '', // Optional
      forceCodeForRefreshToken: true,
    });
  };

  const checkIfUserIsSignedIn = async () => {
    try {
      // Check if user data exists in AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        // Verify we have essential data and Google Sign-In session is still valid
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn && parsedUserData.userId) {
          console.log('User already signed in:', parsedUserData.userId);
          navigation.navigate('Dashboard');
          return;
        } else {
          // Clear stored data if Google session is invalid or data is incomplete
          await AsyncStorage.removeItem('userData');
          console.log('Cleared invalid stored user data');
        }
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
      // Clear any corrupted data
      await AsyncStorage.removeItem('userData');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsSigningIn(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the user's ID token and basic profile info
      const userInfo = await GoogleSignin.signIn();


      
      // Verify we have essential user data before proceeding
      if (!userInfo || !userInfo.user || !userInfo.user.id) {
        Alert.alert('Sign-in failed', 'Unable to retrieve user information');
        return;
      }
      
      // Prepare user data with unique ID for API usage
      const userData = {
        userId: userInfo.user.id, // Unique Google ID for API calls
        email: userInfo.user.email,
        name: userInfo.user.name,
        photo: userInfo.user.photo,
        familyName: userInfo.user.familyName,
        givenName: userInfo.user.givenName,
        idToken: userInfo.idToken, // For server verification if needed
        serverAuthCode: userInfo.serverAuthCode, // For server-side authentication
        signInTime: new Date().toISOString(),
      };
      
      // Store user data for persistence
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('User signed in successfully:');
      console.log('User ID:', userData.userId);
      console.log('Email:', userData.email);
      console.log('Name:', userData.name);
      
      // Only navigate if sign-in was completely successful
      navigation.navigate('PhoneName');
      
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      
      // Stay on login screen and show appropriate error
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled - no alert needed, just stay on screen
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in in progress', 'Please wait for the current sign-in to complete');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services unavailable', 'Google Play Services is not available or needs to be updated');
      } else {
      navigation.navigate('PhoneName');

        // Alert.alert('Sign-in failed', 'Unable to sign in with Google. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const signInWithApple = () => {
    // Apple Sign-In implementation would go here
    Alert.alert('Apple Sign-In', 'Apple Sign-In not implemented yet');
  };

  if (isCheckingAuth) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/offstrap.jpg')} // Replace with your logo path
        style={styles.logo}
      />
      
      <TouchableOpacity 
        style={[styles.googleBtn, isSigningIn && styles.disabledBtn]} 
        onPress={signInWithGoogle}
        disabled={isSigningIn}
      >
        {isSigningIn ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Image
              source={require('../assets/google_logo.png')}
              style={styles.icon}
            />
            <Text style={styles.btnText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleBtn} onPress={signInWithApple}>
        <Image
          source={require('../assets/apple_logo.png')}
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
  centered: {
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 80,
    marginBottom: 60,
    // tintColor: '#fff', // This will invert the logo to white
    filter: "invert(100%)",
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
  disabledBtn: {
    opacity: 0.6,
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
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});