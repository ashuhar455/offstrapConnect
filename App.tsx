import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Dashboard from './screens/dashboard';
import LoginScreen from './screens/login';
import BLEDeviceSearchScreen from './screens/discovery';
import SettingsScreen from './screens/settings';
import BagHub from './screens/bagHub';
import FingerprintEnrollmentScreen from './screens/fingerEnroll';
import AccountScreen from './screens/accountsSetting';
import AppSecurityScreen from './screens/appSecurity';
import UsageChartScreen from './screens/usage';
import AboutScreen from './screens/about';
import SmartDisplayScreen from './screens/smartScreen';
import NotificationSettingsScreen from './screens/notification';
import PhoneNameScreen from './screens/userInfo';
import BagSetupScreen from './screens/bagOtp';


export type RootStackParamList = {
  Dashboard: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer> 
      <Stack.Navigator >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BagHub" 
          component={BagHub} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="FPEnroll" 
          component={FingerprintEnrollmentScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Discovery" 
          component={BLEDeviceSearchScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Account" 
          component={AccountScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Security" 
          component={AppSecurityScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Usage" 
          component={UsageChartScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SmartDisplay" 
          component={SmartDisplayScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationSettingsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PhoneName" 
          component={PhoneNameScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BagSetup" 
          component={BagSetupScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
