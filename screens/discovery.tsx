import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';

export default function DiscoveryScreen({ navigation }) {
  const [showBags, setShowBags] = useState(false);

  const devices = [
    { id: '1', name: 'Trail 1.0', code: 'OFS-A1-A014E6CEEDEB', strength: 4 },
  ];

  const handleScan = () => {
    setTimeout(() => {
      setShowBags(true);
    }, 1000); // 1 second delay
  };

  const handleBagPress = () => {
    setTimeout(() => {
      navigation.navigate('BagSetup');
    }, 2000);
  };

  const renderSignalIcon = (strength: number) => {
    const bars = [1, 2, 3, 4];
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 6 }}>
        {bars.map((bar) => (
          <View
            key={bar}
            style={{
              width: 3,
              height: bar * 6,
              backgroundColor: bar <= strength ? '#0f0' : '#555',
              marginHorizontal: 1,
              borderRadius: 1,
            }}
          />
        ))}
      </View>
    );
  };

  const renderBagCard = ({ item }) => (
    <TouchableOpacity style={styles.bagCard} onPress={handleBagPress}>
      {/* Top Row: Bag icon + Name + Signal */}
      <View style={styles.cardTop}>
        <Image
          source={require('../assets/bagorange.png')} // Replace with your bag logo
          style={styles.bagIcon}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.bagName}>{item.name}</Text>
        
          </View>
          <Text style={styles.bagCode}>{item.code}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Logo always stays at top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/offstrap.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Scan button */}
      {!showBags && (
        <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
          <Text style={styles.btnText}>Scan</Text>
        </TouchableOpacity>
      )}

      {/* Bag List */}
      {showBags && (
        <View style={styles.resultsSection}>
          <FlatList
            data={devices}
            renderItem={renderBagCard}
            keyExtractor={(item) => item.id}
            numColumns={1}
            contentContainerStyle={{ gap: 14 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 80,
    // marginBottom: 20,
  },
  logo: {
    width: 500,
    height: 140,
    // marginBottom: 60,
    // tintColor: '#fff', // This will invert the logo to white
    filter: "invert(100%)",
  },
  scanBtn: {
    backgroundColor: '#fff',
    width: 200,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  resultsSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  bagCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
    flex: 1,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bagIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    // tintColor: '#fff',
  },
  bagName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  bagCode: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});
