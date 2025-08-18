import React, { useState } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Fixed: specify icon set

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size; // Based on iPhone X width
const verticalScale = (size: number) => (screenHeight / 812) * size; // Based on iPhone X height
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;


export default function BagHub({navigation}) {
    const [travelMode, setTravelMode] = useState(false);
    const [lostMode, setLostMode] = useState(false);
    const [darkTheme, setDarkTheme] = useState(true);

    return (
        <SafeAreaProvider>
            <ScrollView style={styles.container}>
                <Text style={styles.heading}>Bag Hub</Text>

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

                <TouchableOpacity style={styles.bagInfoCard} onPress={() => { }}>
                    <View style={styles.bagIconContainer}>

                        <View style={styles.bagIconHolder}>
                            <Image source={require("../assets/bagorange.png")} style={styles.bagIcon} />
                        </View>
                    </View>
                    <View style={styles.bagInfoTextContainer}>
                        <Text style={styles.bagInfoCenterTitle}>John's OFFSTRAP Trail 1.1</Text>
                    </View>
                </TouchableOpacity>


            <TouchableOpacity style={[styles.bagInfoCard, {backgroundColor:"black", justifyContent:"center", paddingTop:0}]} 
          onPress={() => {navigation.navigate("Discovery")}}
            
            >
                    <View style={styles.bagIconContainer}>

                        <View>
                            <Image source={require("../assets/add.png")} style={[styles.bagIcon, {height:25,width:25}]} />
                        </View>
                    </View>
                    <View style={styles.bagInfoTextContainer}>
                        <Text style={[styles.bagInfoCenterTitle, {color: "white", fontWeight: 350}]}>Add an Offstrap</Text>
                    </View>
                </TouchableOpacity>



            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
        marginTop: 4,
    },
    heading: {
        fontSize: 34,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "left"
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
        marginRight: 16,
    },
    label: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
});