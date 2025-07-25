import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const region = {
    latitude: 12.9692,
    longitude: 79.1559,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region}>
        <Marker coordinate={region} title="VIT" description="Vellore Institute of Technology" />
      </MapView>

      {/* Floating bottom panel */}
      <View style={styles.bottomCard}>
        <View style={styles.profileRow}>
          <Image
            source={require('./assets/backpack.png')} // Replace with your own image
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>a's OFFSTRAP Trail 1.0</Text>
            <View style={styles.batteryRow}>
              <Image
                source={require('./assets/battery.png')} // Replace with green battery icon
                style={styles.batteryIcon}
              />
              <Text style={styles.batteryText}>100%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Image
              source={require('./assets/signal.png')} // 4G signal icon
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>Network{'\n'}4G</Text>
          </View>
          <View style={styles.statusBox}>
            <Image
              source={require('./assets/bluetooth.png')}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>Bluetooth{'\n'}Connected</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBox}>
            <Image source={require('./assets/lock.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Locked</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBox}>
            <Image source={require('./assets/track.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBox}>
            <Image source={require('./assets/shield.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Safety</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  info: {
    marginLeft: 10,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  batteryIcon: {
    width: 24,
    height: 12,
    marginRight: 5,
  },
  batteryText: {
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statusBox: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 24,
    height: 24,
    tintColor: '#0f0',
  },
  statusText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionBox: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  actionText: {
    color: '#fff',
    marginTop: 4,
  },
});
