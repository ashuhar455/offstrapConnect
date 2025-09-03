import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Fixed: specify icon set

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size; // Based on iPhone X width
const verticalScale = (size: number) => (screenHeight / 812) * size; // Based on iPhone X height
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;


export default function SettingsScreen({navigation}) {
  const [travelMode, setTravelMode] = useState(false);
  const [lostMode, setLostMode] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

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
          onValueChange={setTravelMode}
        />
        <SettingSwitch
          icon={require("../assets/lost.png")}
          label="Lost Mode"
          value={lostMode}
          onValueChange={setLostMode}
        />
       
      </View>

      <View style={styles.section}>
         
        <SettingItem icon={require("../assets/display.png")} label="Smart Display" onPress={()=>{navigation.navigate("SmartDisplay")}}/>
        <SettingItem icon={require("../assets/notification.png")} label="Notification" onPress={()=> {navigation.navigate("Notifications")}} />
      </View>
      <View style={styles.section}>
        {/* <SettingItem icon="person" label="Fingerprint Manager" /> */}
        <TouchableOpacity style={styles.item} 
          onPress={() => {navigation.navigate("FPEnroll")}}
        >
      <Image source={require("../assets/fingerprint.png")} style={styles.icon} />
      
      <Text style={styles.label}>Fingerprint Manager</Text>
    </TouchableOpacity>

        <SettingItem icon={require("../assets/about.png")} label="About" onPress={()=> {navigation.navigate("About")}}/>
        <SettingItem icon={require("../assets/logout.png")} label="Logout" onPress={() => {handleSignOut(navigation)}} />
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