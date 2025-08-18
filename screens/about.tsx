import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaProvider style={styles.container}>
      <View>
        <Text style={styles.heading}>About The OffStrap App</Text>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.content}>
            <Text style={styles.bold}>Application Name:</Text> OffStrap Trail{'\n'}
            <Text style={styles.bold}>App Version:</Text> 1.3{'\n'}
            <Text style={styles.bold}>Hardware Version:</Text> Trail Series 1.0{'\n'}
            <Text style={styles.bold}>Release Date:</Text> July 2025{'\n'}
            <Text style={styles.bold}>Developer:</Text> OffStrap Innovations Pvt. Ltd.{'\n'}
            <Text style={styles.bold}>Official Contact:</Text> info@offstrap.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <Text style={styles.content}>
            OffStrap Trail is the official companion application for the OffStrap range of smart travel gear. This software enables secure Bluetooth and LTE communication with OffStrap-certified luggage only, and is designed to provide users with enhanced control, monitoring, and protection features for their bags.
          </Text>
          <Text style={styles.content}>
            This application is licensed for use solely with OffStrap-authorized hardware. Unauthorized pairing, reverse engineering, or modification of software or hardware components is strictly prohibited and voids any product warranties or service commitments.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features Included in Version 1.3</Text>
          
          <Text style={styles.featureTitle}>Smart Unlocking System</Text>
          <Text style={styles.content}>
            • App-based lock/unlock control{'\n'}
            • Fingerprint-based access via bag-integrated sensor{'\n'}
            • Remote locking during Lost Mode or travel emergencies
          </Text>

          <Text style={styles.featureTitle}>Location Tracking</Text>
          <Text style={styles.content}>
            • Live GPS tracking via onboard SIM module{'\n'}
            • Bluetooth proximity tracking{'\n'}
            • Lost Mode with high-frequency location pings{'\n'}
            • "Track" button to retrieve last known bag location
          </Text>

          <Text style={styles.featureTitle}>Travel Mode</Text>
          <Text style={styles.content}>
            • Automatically optimizes network and battery usage while in transit for airline travel{'\n'}
            • Temporarily disables non-essential sensors during long travel durations
          </Text>

          <Text style={styles.featureTitle}>Usage & Activity Metrics</Text>
          <Text style={styles.content}>
            • View unlock events, travel data, and bag usage logs{'\n'}
            • Real-time signal strength and battery status
          </Text>

          <Text style={styles.featureTitle}>Security and Alerts</Text>
          <Text style={styles.content}>
            • Enable app access control via fingerprint, PIN, or password{'\n'}
            • Auto-lock after periods of inactivity{'\n'}
            • Notifications for unauthorized access, low battery, or suspicious activity
          </Text>

          <Text style={styles.featureTitle}>Notifications Management</Text>
          <Text style={styles.content}>
            • Toggle and configure alerts{'\n'}
            • Set thresholds for battery, location, or unlock warnings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Support</Text>
          <Text style={styles.content}>
            If you encounter technical issues, wish to report a bug, or need help configuring your OffStrap product, please contact our support team:
          </Text>
          <Text style={styles.content}>
            <Text style={styles.bold}>Email:</Text> info@offstrap.com{'\n'}
            <Text style={styles.bold}>Response Time:</Text> Within 48 business hours (Mon–Fri)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer of Liability</Text>
          <Text style={styles.content}>
            By using this application and associated hardware, you agree to the following terms:
          </Text>
          <Text style={styles.content}>
            OffStrap Innovations Pvt. Ltd. shall not be held responsible for any physical damage, loss, or theft of bags, belongings, or personal property.
          </Text>
          <Text style={styles.content}>
            The software is intended to assist in monitoring and securing your bag. However, no guarantee is provided for the absolute prevention of theft, unauthorized access, or data loss.
          </Text>
          <Text style={styles.content}>
            Misuse of the hardware or software, including but not limited to tampering, force unlocking, unauthorized firmware modification, or operation outside of documented use cases, will void warranty and release OffStrap of any liability.
          </Text>
          <Text style={styles.content}>
            This application may use GPS and BLE features in the background. Continued use may affect device and bag battery life.
          </Text>
          <Text style={styles.content}>
            OffStrap does not collect personal user data beyond what is essential for device pairing and basic usage analytics. Refer to the Privacy Policy for further details.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License & Intellectual Property</Text>
          <Text style={styles.content}>
            All contents of this application, including UI, icons, firmware protocols, and connectivity architecture, are the intellectual property of OffStrap Innovations Pvt. Ltd. Unauthorized replication or redistribution is prohibited.
          </Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Updates</Text>
          <Text style={styles.content}>
            This app will periodically receive updates to introduce new features and performance improvements. We recommend keeping both your app and bag firmware updated to ensure optimal functionality.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});