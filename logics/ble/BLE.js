/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  AppState,
  TouchableHighlight,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { REACT_APP_DEVICE_SSID } from './config'
import toast from 'react-native-toast-message'

import base64 from 'react-native-base64';

import LottieView from 'lottie-react-native';


import WifiManager from "react-native-wifi-reborn";
import {BleManager, Device} from 'react-native-ble-plx';
const BLTManager = new BleManager();
// const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
// const MESSAGE_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';
// const BOX_UUID = 'f27b53ad-c63d-49a0-8c0f-9f297e6cc520';
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const MESSAGE_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const BOX_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';



const App = () => {

  let alreadyOn = true
  let superxx = ' '
  let val_type = null

  const [isConnected, setIsConnected] = useState(false);
  //What device is connected?
  //allstate



  const [state, setState] = useState({
    loading: false,
    permissionEnabled: null,
    bleEnabled: null,
    wifiEnabled: null,
    scanning: false,
    connected: false,
    thedevice: null,
    findingwifi: false,
    showwifilist: false,
    wifilist: [],
    selectedwifi: null,
    selectedwifipassword: __DEV__ ? 'YVGKQB7QYX' : '',
    deviceName: '',
    wifiauth: null,  // false , true
    backable: false,
    networkError: false,
    step: 0
  })
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('');
  const [boxvalue, setBoxValue] = useState(false);
  const [valueType, setvalueType] = useState(null); // get1, get2  wpaset // set1, set2
  const [error, setError] = useState(false)
  const [wpagetstring, setwpagetstring] = useState(' ')
  const [wifilist, setwifilist] = useState(null)
  const hide = true
  //const appState = useRef(AppState.currentState);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);


  useEffect(()=> {
      console.log('changed mofo',wpagetstring)
    },[wpagetstring])

  useEffect(() => {

    step1()


    const subscription = BLTManager.onStateChange((state) => {
        console.log('state',state)
        if (state === 'PoweredOn') {
            //step1()
            //this.scanAndConnect();
            //subscription.remove();
            //startScan()
            //setState(prev => ({...prev, bleEnabled: true, scanning: true}))
        }
        else {
            //setState(prev => ({...prev, bleEnabled: false}))
        }
    });

    // const subscription2 = AppState.addEventListener("change", nextAppState => {
    //   if (
    //     appState.current.match(/inactive|background/) &&
    //     nextAppState === "active"
    //   ) {
    //     console.log("App has come to the foreground!");
    //     setState(prev => ({...prev, step: 0 }) )
    //     setTimeout(()=> {
    //       step1()
    //     },200)
    //   }
    //
    //   appState.current = nextAppState;
    //   setAppStateVisible(appState.current);
    //   console.log("AppState", appState.current);
    // });

    return () => {
      console.log('disconenct device')
      disconnectDevice()
      subscription
    }
  },[])


  //1. Permission
  const step1 = () => {

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
            setState(prev => ({...prev, step: 1, permissionEnabled: true }))
            step2()
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
                setState(prev => ({...prev, step: 1, permissionEnabled: true }))
                step2()
              } else {
                console.log("User refuse");
                alreadyOn = false
                setState(prev => ({...prev, permissionEnabled: false }))
              }
            });
          }
      });
    }

  }

  //2. check wifi available
  const step2 = async () => {
      const enabled = await WifiManager.isEnabled();
      console.log('enabled', enabled)
      if (enabled){
        setState(prev => ({...prev, wifiEnabled: enabled, step: 2 }))
        step3()
      } else {
        setState(prev => ({...prev, wifiEnabled: enabled }))
        alreadyOn = false
      }

  }

  //3. check if bluetooth is enabled
  const step3 = async () => {
      const enabled = await BLTManager.state()
      console.log('enabled 2',enabled)
      if(enabled == 'PoweredOn'){
        setState(prev => ({...prev, bleEnabled: true, step: 3, scanning: true }))
        step4()
      }
      else {
        setState(prev => ({...prev, bleEnabled: false }))
        alreadyOn = false
      }
  }


  //4. start scan
  const step4 = () => {
    BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
        console.log('eror',String(error))
        if(String(error) === 'BleError: BluetoothLE is powered off'){
          Toast.show({ text1: 'Bluetooth is off. Kindly enable it.' })
        }
        if(String(error) === 'BleError: Location services are disabled'){
          Toast.show({ text1: 'Enable your location to connect.' })
        }
      }
      console.log('scannedDevice',scannedDevice)
      if (scannedDevice && scannedDevice.name == REACT_APP_DEVICE_SSID) {
        BLTManager.stopDeviceScan();
        connectDeviceFunc(scannedDevice);
        console.log('connect here nigga')
      }
    });

    // stop scanning devices after 5or 10 seconds
    setTimeout(() => {
      BLTManager.stopDeviceScan();
    }, 10000);

  }

  //Connect the device and start monitoring characteristics
  // 4.1 connect to device and
  const connectDeviceFunc = async (device) => {
    console.log('connecting to Device:', device.name);

    device
      .connect({ requestMTU: 187 })
      .then(device => {
        setState(prev => ({...prev, connected: true, thedevice: device, findingwifi: true }))
        setConnectedDevice(device);
        setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        console.log('yes yes ',device)

        // on Device disconnected , listner
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });

        //Read inital values

              //Message
              device
                .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
                .then(valenc => {
                  console.log('hello',valenc)
                  //setMessage(base64.decode(valenc?.value));
                  //setMessage(base64.decode(valenc.value));
                }).catch(error => {
                    console.log('Error_1',error)
                  })

              //BoxValue
              // device
              //   .readCharacteristicForService(SERVICE_UUID, BOX_UUID)
              //   .then(valenc => {
              //     console.log('hello2',valenc)
              //     //setBoxValue(StringToBool(base64.decode(valenc?.value)));
              //     setBoxValue(StringToBool(base64.decode(valenc.value)));
              //   }).catch(error => {
              //       console.log('Error_2',error)
              //     })

              //monitor values and tell what to do when receiving an update

              //Message
              device.monitorCharacteristicForService(
                SERVICE_UUID,
                MESSAGE_UUID,
                (error, characteristic) => {
                  console.log('Error_3',error)
                  if (characteristic?.value != null) {
                    setMessage(String(base64.decode(characteristic.value)).trim());
                    //console.log('valueType',val_type, val_type === 'wpaget_1')
                    //console.log('characteristic.value',base64.decode(characteristic.value), base64.decode(characteristic.value))

                    console.log(
                      'Message update received: ',
                      base64.decode(characteristic.value),
                    );
                  }
                },
                'messagetransaction',
              );

              //BoxValue
              // device.monitorCharacteristicForService(
              //   SERVICE_UUID,
              //   BOX_UUID,
              //   (error, characteristic) => {
              //     console.log('Error_4',error)
              //     if (characteristic?.value != null) {
              //       setBoxValue(StringToBool(base64.decode(characteristic.value)));
              //       console.log(
              //         'Box Value update received: ',
              //         base64.decode(characteristic.value),
              //       );
              //     }
              //   },
              //   'boxtransaction',
              // );



        console.log('Connection established');
        // now get the list of wifi
        wpaget(0,device)
      });
  }


  //4.2 get list of available wifi
  const wpaget = async (arg = 0, device) => {
    console.log('get the list mf',arg, device)
    if(arg == 0){

      setvalueType('wpaget_0')
      console.log('state.thedevice',state.thedevice)
      BLTManager.writeCharacteristicWithResponseForDevice(
        device.id,
        SERVICE_UUID,
        BOX_UUID,
        base64.encode('wpaget'),
      ).then(characteristic => {
        console.log('Boxvalue changed to :', base64.decode(characteristic.value));

      })

   } else if (arg == 1){
     console.log('now we here 2',arg)
     BLTManager.writeCharacteristicWithResponseForDevice(
       device.id,
       SERVICE_UUID,
       BOX_UUID,
       base64.encode('end'),
     ).then(characteristic => {
       console.log('Boxvalue changed to :', base64.decode(characteristic.value));

     })
   }
  }






  const testWifi = () => {
    WifiManager.connectToProtectedSSID(state.selectedwifi, state.selectedwifipassword, false)
    .then(() => {
      console.log('')
      setState(prev => ({...prev, wifiauth: true }))
    })
    .catch(error => {
      setState(prev => ({...prev, wifiauth: false }))
    })
  }



  const isDeviceConnected = (device) => {
    BLTManager.isDeviceConnected(device)
    .then(response => {
        console.log('response',response)
      }).catch(error => {
          console.log('connection error',error)
        })
  }


  useEffect(() => {

    if(message !== null && valueType !== null ){

      console.log('reading msg 1 ',superxx)

      var args = valueType.split('_') //1. args[1]
      console.log('args',args)
      console.log('useEffect valueType',valueType,message)
      if(valueType === 'wpaget_0' || valueType === 'wpaget_1'){

          if(valueType === 'wpaget_0' && message === 'wpagetstart'){
            console.log('first step done')
            let nextlevel = parseInt(args[1])+1
            setvalueType(`wpaget_${nextlevel}`)
            console.log('hope its updated by now',state.thedevice)
            wpaget(nextlevel,state.thedevice)
          }
          console.log('must>>')
          console.log(valueType === 'wpaget_1')
          if(valueType === 'wpaget_1' && message !== 'end'){
            console.log('concat this shit')
            console.log('message',message)
            //console.log('wpagetstring2',wpagetstring2)
            superxx = superxx+message
            console.log('totalstring',superxx)
            //setwpagetstring(totalstring)
            //wpagetstring2 = totalstring
          }
          if(valueType === 'wpaget_1' && message === 'end'){
            console.log('this is our wifi list',JSON.parse(wpagetstring2))
            try {
              var wpagetstring2 = JSON.parse(superxx)
              setState(prev => ({...prev, scanning: false, findingwifi: false, wifilist: wpagetstring2.scan, step: 5 }))
              setwifilist(wpagetstring2.scan)
            } catch(error){
              //error
              console.log('shit is fuckedup',error)
            }

          }



      }
      else if(valueType === 'wpaset_0' || valueType === 'wpaset_1' || valueType === 'wpaset_2' || valueType === 'wpaset_3' || valueType === 'wpaset_4'){
          if(valueType === 'wpaset_0' && message === 'wpasetstart' ){
            let nextlevel = parseInt(args[1])+1
            setvalueType(`wpaset_${nextlevel}`)
            wpaset(nextlevel)
          }
          if(valueType === 'wpaset_1' && message === 'begin' ){
            let nextlevel = parseInt(args[1])+1
            setvalueType(`wpaset_${nextlevel}`)
            wpaset(nextlevel)
          }
          if(valueType === 'wpaset_2' && String(message).startsWith  === 'ip:' ){
            console.log('I got the ip',message)
          }

      }

    }
  },[message])

  useEffect(() => {
    if(error !== false ){
      console.log('useEffect error',error)
    }
  },[error])

  // useEffect(() => {
  //   if(valueType !== null ){
  //
  //   }
  // },[valueType])







  const disconnectDevice = async () => {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {

        BLTManager.writeCharacteristicWithResponseForDevice( connectedDevice?.id, SERVICE_UUID, BOX_UUID, base64.encode('dc'))
        .then((characteristic)=> {
          console.log('wpaset_0 characteristic :', base64.decode(characteristic.value));
        }).catch(error => {
            console.log('wpaset_0 error',error)
            setError(true)
        })

        setTimeout(()=> {
          BLTManager.cancelTransaction('messagetransaction');
          BLTManager.cancelTransaction('nightmodetransaction');
          BLTManager.cancelDeviceConnection(connectedDevice.id).then(() => { console.log('Hello') });
        },500)




      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setIsConnected(false);
      }
    }
  }




  const sendBoxValueSet = async () => {

    BLTManager.writeCharacteristicWithResponseForDevice(
      connectedDevice?.id,
      SERVICE_UUID,
      BOX_UUID,
      base64.encode('wpaset'),
    )
    .then(characteristic1 => {
        console.log('xx',base64.decode(characteristic1.value))
        return BLTManager.writeCharacteristicWithResponseForDevice(
          connectedDevice?.id,
          SERVICE_UUID,
          BOX_UUID,
          base64.encode('ssid:JIOX'),
        )
    }).then(characteristic2 => {
        return BLTManager.writeCharacteristicWithResponseForDevice(
          connectedDevice?.id,
          SERVICE_UUID,
          BOX_UUID,
          base64.encode('pass:YVGKQB7QYX'),
        )
    }).then(characteristic3 => {
        return BLTManager.writeCharacteristicWithResponseForDevice(
          connectedDevice?.id,
          SERVICE_UUID,
          BOX_UUID,
          base64.encode('end'),
        )
    }).then((characteristic4)=> {
          console.log('xx',base64.decode(characteristic4.value))

    })

  }


  const waitforme = (milisec) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
  }

  const wpaset = async (arg = 0) => {
    /* protocol
    wpaset >
    return start
    len:10 >
    return begin
    loop >
    ...
    end >
    return ip
    */

    console.log('hi current arg is',arg)

    const str =  JSON.stringify({ req: 'wpaset', ssid: 'JIOX', pass: 'YVGKQB7QYX', hash: 'rgb1', stat: true })
    var chunks = [];
    for (var i = 0, charsLength = str.length; i < charsLength; i += 19) {
        chunks.push(str.substring(i, i + 19));
    }
    console.log(chunks);

    if(arg == 0){
      console.log('we hit step 1',arg)
      setvalueType('wpaset_0')
      BLTManager.writeCharacteristicWithResponseForDevice( connectedDevice?.id, SERVICE_UUID, BOX_UUID, base64.encode('wpaset'))
      .then((characteristic)=> {
        console.log('wpaset_0 characteristic :', base64.decode(characteristic.value));
      }).catch(error => {
          console.log('wpaset_0 error',error)
          setError(true)
      })


    } else if (arg == 1){
      console.log('now we here 2',arg)
      console.log(`len:${chunks.length}`)
      BLTManager.writeCharacteristicWithResponseForDevice( connectedDevice?.id, SERVICE_UUID, BOX_UUID, base64.encode(`len:${chunks.length}`))
      .then((characteristic)=> {
        console.log('wpaset_1 characteristic :', base64.decode(characteristic.value));
      }).catch(error => {
          console.log('wpaset_1 error',error)
          setError(true)
      })

    } else if (arg == 2){
      //sending whole loop now
      console.log('send this ')
      var index = 0
      for ( const each of chunks) {
          //await waitforme(300)
          index++
          console.log('one by one ',index,chunks.length)

            await waitforme(100)
            BLTManager.writeCharacteristicWithResponseForDevice(
              connectedDevice?.id,
              SERVICE_UUID,
              BOX_UUID,
              base64.encode(each),
            )


          // await waitforme(100).then(() => {
          //   console.log('send it >',each)
          //   BLTManager.writeCharacteristicWithResponseForDevice(
          //     connectedDevice?.id,
          //     SERVICE_UUID,
          //     BOX_UUID,
          //     base64.encode(each),
          //   )
          //
          // })
          console.log(each);
          if(index == chunks.length){
            console.log('yes yes')
            BLTManager.writeCharacteristicWithResponseForDevice(
              connectedDevice?.id,
              SERVICE_UUID,
              BOX_UUID,
              base64.encode('end'),
            )
          }
      }

    }


    return




    console.log("Loop execution finished!)");
  }

  const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
  }

  const getNumFruit = fruit => {
      return sleep(1000).then(v => fruitBasket[fruit])
  }


  return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>


            {state.permissionEnabled === false && (
              <View style={{ alignItems: 'center' }}>
              <Text style={{ marginTop: 10, fontSize: 20, color: 'black' }}>Please provide location permission before continue.</Text>
              </View>
            )}

            {state.wifiEnabled === false &&  (
              <View style={{ alignItems: 'center' }}>
              <LottieView style={{ width: 200, height: 200 }} source={require('@images/no-internet.json')} autoPlay loop />
              <Text style={{ marginTop: 10, fontSize: 20, color: 'black' }}>Please turn on your wifi.</Text>
              </View>
            )}

            {state.bleEnabled === false &&  (
              <View style={{ alignItems: 'center' }}>
              <LottieView style={{ width: 200, height: 200 }} source={require('@images/turn-on-bluetooth.json')} autoPlay loop />
              <Text style={{ marginTop: 10, fontSize: 20, color: 'black' }}>Please turn on your bluetooth.</Text>
              </View>
            )}

            {state.scanning && (
              <View style={{ alignItems: 'center' }}>
              <LottieView style={{ width: 200, height: 200 }} source={require('@images/connecting-bluetooth.json')} autoPlay loop />
              {state.connected ?
                <Text style={{ marginTop: 10, fontSize: 20, color: 'black' }}>Connected. Getting list of available wifi network..</Text>
              :
                <Text style={{ marginTop: 10, fontSize: 20, color: 'black' }}>Finding a device..</Text>
              }
              </View>
              )}


              {state.step === 5 }



      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
