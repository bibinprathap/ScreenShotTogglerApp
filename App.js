/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  AppState,
  Platform,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import {NetworkInfo} from 'react-native-network-info';

const {ScreenShot} = NativeModules;

const SecurityScreen = () => <View />;

const showSecurityScreenFromAppState = (appState) =>
  ['background', 'inactive'].includes(appState);

const App: () => React$Node = () => {
  const [disableScreenShotActive, setDisableScreenShotActive] = useState(false);
  const [active, setActive] = useState(true);
  const [postingDeviceinfo, setPostingDeviceinfo] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };
  const sendDeviceinfotoServer = async (nextAppState) => {
    setPostingDeviceinfo(true);

    const ipAddressPromise = new Promise((resolve, reject) => {
      NetworkInfo.getIPV4Address().then((ipv4Address) => {
        console.log(ipv4Address);
        resolve(ipv4Address);
      });
    });
    const macAddressPromise = new Promise((resolve, reject) => {
      DeviceInfo.getMacAddress().then((mac) => {
        resolve(mac);
      });
    });

    const locationPromise = new Promise((resolve, reject) => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          console.log(location);
          resolve(location);
        })
        .catch((error) => {
          // const {code, message} = error;
          // console.warn(code, message);
          reject(error);
        });
    });

    const screenshotstatusPromise = Promise.resolve(disableScreenShotActive);
    const osName = DeviceInfo.getSystemName();
    const osNamePromise = Promise.resolve(osName);

    Promise.all([
      macAddressPromise,
      locationPromise,
      ipAddressPromise,
      screenshotstatusPromise,
      osNamePromise,
    ]).then((values) => {
      console.log(values);
      submitDeviceInfo({
        ipv4Address: values[2],
        location: values[1],
        osName: values[4],
        screenshotstatus: values[3],
        getMacAddress: values[0],
      });
    });
  };
  const submitDeviceInfo = async ({
    ipv4Address,
    location,
    osName,
    screenshotstatus,
    getMacAddress,
  }) => {
    const postData = {
      ipv4Address,
      location,
      osName,
      screenshotstatus,
      getMacAddress,
    };
    try {
      let response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      response = await response.json();
      setPostingDeviceinfo(false);
    } catch (err) {
      setPostingDeviceinfo(false);
      console.log('Error:', err);
    }
  };

  const renderApp = (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{flex: 2}}></View>
          <View style={{paddingVertical: 25, flex: 2}}>
            <View
              style={{
                width: 120,
                height: 120,
                backgroundColor: 'red',
                borderRadius: 8,
              }}></View>
          </View>
          <View style={{flex: 2}}>
            <Text>Enable or disable ScreenShot</Text>
            {/* <Button
              onPress={() => {
                if (Platform.OS === 'android') {
                  ScreenShot.start().then(() => {

                  });
                }
                sendDeviceinfotoServer();
                setDisableScreenShotActive(true);
                Alert.alert('ScreenShot Disabled');
              }}
              title="Activate"
              color="red"
              accessibilityLabel="Click this button to   disable ScreenShot"
            /> */}

            <TouchableOpacity
              activeOpacity={0.8}
              testID={'submit-button'}
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {
                if (!active) {
                  if (Platform.OS === 'android') {
                    ScreenShot.stop().then(() => {});
                  }

                  setDisableScreenShotActive(false);
                  setActive(true);
                  sendDeviceinfotoServer();
                  Alert.alert('ScreenShot Enabled');
                } else {
                  if (Platform.OS === 'android') {
                    ScreenShot.start().then(() => {});
                  }
                  sendDeviceinfotoServer();
                  setDisableScreenShotActive(true);
                  setActive(false);
                  Alert.alert('ScreenShot Disabled');
                }
              }}>
              <View
                style={[
                  styles.signUp,
                  {backgroundColor: active ? '#00cc66' : '#3333cc'},
                ]}>
                <FontAwesome5
                  name={active ? 'times' : 'check-circle'}
                  solid
                  size={18}
                  color="white"
                />
                {/* <ActivityIndicator size="small" color="white" /> */}
                <Text style={styles.span3}>
                  {active ? 'DE-ACTIVATE' : 'ACTIVATE'}
                </Text>
              </View>
            </TouchableOpacity>
            {/* <Button
              onPress={() => {
                if (Platform.OS === 'android') {
                  ScreenShot.stop().then(() => {

                  });
                }

                setDisableScreenShotActive(false);
                sendDeviceinfotoServer();
                Alert.alert('ScreenShot Enabled');
              }}
              title="Deactivate"
              color="green"
              accessibilityLabel="Click this button to Enable   ScreenShot"
            /> */}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
  //
  return Platform.OS === 'ios' &&
    disableScreenShotActive &&
    showSecurityScreenFromAppState(appStateVisible) ? (
    <SecurityScreen />
  ) : (
    renderApp
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  signUp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08945C',
    paddingLeft: 25,
    paddingRight: 25,
    height: 40,
    width: 150,
    borderRadius: 30,
    marginVertical: 16,
  },
  span3: {
    color: 'white',
    fontSize: 12,
    paddingLeft: 20,
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
