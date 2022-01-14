// App.js

import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Text,
} from 'react-native';

import Login from './src/Login';
import Signup from './src/SignUp';
import Dashboard from './src/screens/DashboardScreen';
import DashboardLogin from './src/Dashboard';
import CustomerRegister from './src/screens/CustomerRegister';
import SellerRegister from './src/screens/TrainerRegister';

import ProfileScreen from './src/screens/ProfileScreen';
import AddressScreen from './src/screens/AddressScreen';
import GetATrainerScreen from './src/screens/GetATrainerScreen';
import CustomerProfileScreen from './src/screens/CustomerProfileScreen';
import TrainerProfileScreen from './src/screens/TrainerProfileScreen';
import ClienteleScreen from './src/screens/ClienteleScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';
import {LogBox, Dimensions, Platform} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {TransitionPresets} from '@react-navigation/stack';
import {request, PERMISSIONS} from 'react-native-permissions';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = props => {
  const toggleDrawer = () => {
    props.navigationProps.navigation.toggleDrawer();
  };

  const [userData, setUserData] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [fullName, setFullName] = React.useState(null);
  const [userPhoto, setUserPhoto] = React.useState(null);

  React.useEffect(() => {
    //this.signOut()
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [props]);

  React.useEffect(() => {
    // const subscriber = firestore()
    //   .collection('users/' + userData ? userData.uid : '')
    //   .onSnapshot(async documentSnapshot => {
    //     console.log('documentSnapshot', await documentSnapshot);
    //     // setUserData(documentSnapshot);
    //   });
    // return subscriber;
    const user = auth().currentUser;
    if (user) {
      database()
        .ref('users/' + user.uid)
        .once('value')
        .then(snapshot => {
          //console.log('User data: ', snapshot.val());
          if (snapshot.val() !== null) {
            setUserData(user);
            console.log('snapshot.val()', snapshot.val());
            setUserPhoto(snapshot.val().userPhoto);
            //console.log(snapshot.val().userPhoto,'snapshot.val().userPhoto')
            if (
              snapshot.val().userPhoto !== 'none' &&
              !snapshot.val().userPhoto
            ) {
              console.log('no image');
              this.onAuthStateChanged(user);
            }
          } else {
            setUserData(user);
            console.log(user, 'user not register');
          }
        })
        .catch(error => console.log(error, 'user Data error'));
    }
  }, []);

  function onAuthStateChanged(user) {
    if (user) {
      setUserData(user);
      database()
        .ref('users/' + user.uid)
        .once('value')
        .then(snapshot => {
          //console.log('User data: ', snapshot.val());
          if (snapshot.val() !== null) {
            setUserData(user);
            console.log('snapshot.val()', snapshot.val());
            setUserPhoto(snapshot.val().userPhoto);
            //console.log(snapshot.val().userPhoto,'snapshot.val().userPhoto')
            if (
              snapshot.val().userPhoto !== 'none' &&
              !snapshot.val().userPhoto
            ) {
              console.log('no image');
              this.onAuthStateChanged(user);
            }
          } else {
            setUserData(user);
            console.log(user, 'user not register');
          }
        })
        .catch(error => console.log(error, 'user Data error'));
    }
    if (!user) {
      this.props.navigation.navigate('Login');
    }
  }

  auth().onAuthStateChanged(async function (user) {
    if (user) {
      console.log('user.uid', user.uid);
      database()
        .ref('users/' + user.uid)
        .on('value', snapshot => {
          console.log('here we go', user);
          if (snapshot.val()) {
            setRole(snapshot.val().role);
            setFullName(snapshot.val().fullName);
            setUserPhoto(snapshot.val().userPhoto);
          } else {
            setUserPhoto(user.userPhoto);
            setFullName(user.displayName);
            database()
              .ref('users/' + user.uid + '/')
              .set({
                email: user.email,
                fullName: user.displayName,
                userPhoto: user.userPhoto,
                role: 'customer',
              });
          }
        });
    }
  });

  console.log(userPhoto, 'userPhotoo');
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 10,
          paddingLeft: 5,
          marginBottom: 10,
          backgroundColor: '#22191A',
          // inactiveTintColor: '#9ABDC2',
          //   activeBackgroundColor: '#22191A',
          width: Dimensions.get('window').width,
          height: 60,
          alignItems: 'center',
          zIndex: 100000,
          position: 'absolute',
          bottom: -10,
          left: -10,
        }}>
        <TouchableOpacity
          onPress={toggleDrawer}
          style={{position: 'relative', top: 5}}>
          {/*Donute Button Image */}
          <Image
            source={require('./src/assets/burgerLight.png')}
            style={{
              width: 25,
              height: 25,
              marginLeft: 12,
              marginBottom: 20,
              marginTop: 10,
              // position: 'relative',
              // top: -24,
            }}
          />
        </TouchableOpacity>
      </View>
      {userData && (
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            paddingLeft: 5,
            // inactiveTintColor: '#9ABDC2',
            //   activeBackgroundColor: '#22191A',
            width: Dimensions.get('window').width,
            height: 60,
            alignItems: 'center',
            zIndex: 100000,
            position: 'absolute',
            top: 0,
            left: -10,
          }}>
          <View style={{height: 'auto', justifyContent: 'flex-start'}}>
            <Image
              source={
                userPhoto && userPhoto !== 'null' && userPhoto !== 'none'
                  ? {uri: userPhoto}
                  : require('./src/assets/profile_photo.png')
              }
              style={{
                width: 45,
                height: 45,
                marginRight: 15,
                borderRadius: 50,
              }}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'CircularStd-Bold',
                color: 'black',
              }}>
              {fullName}
            </Text>
            {/* <Text
              style={{
                color: '#4E4E4E',
                textTransform: 'capitalize',
                fontSize: 16,
                // fontFamily: 'Antonio-Regular',
                fontFamily: 'CircularStd-Book',
              }}>
              {role}
            </Text> */}
          </View>
        </View>
      )}
    </View>
  );
};

const screenOptions = navigation => ({
  headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
  headerRight: () => (
    <Image
      source={require('./src/assets/logo1.jpeg')}
      style={{
        width: 63,
        height: 40,
        marginRight: 10,
        marginTop: -60,
        position: 'relative',
        zIndex: 0,
      }}
    />
  ),
  headerTitle: <></>,
  headerStyle: {
    backgroundColor: '#9abdc1',
    height: 120,
    zIndex: 1,
    shadowColor: 'transparent',
  },
  gestureEnabled: true,
  ...TransitionPresets.ScaleFromCenterAndroid,
});

function DashboardStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{...TransitionPresets.ScaleFromCenterAndroid}}
      />
    </Stack.Navigator>
  );
}

function ProfileStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function GetATrainerStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen
        name="GetATrainerScreen"
        component={GetATrainerScreen}
        // options={{...TransitionPresets.ModalSlideFromBottomIOS}}
      />
    </Stack.Navigator>
  );
}

function ClienteleStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen name="ClienteleScreen" component={ClienteleScreen} />
    </Stack.Navigator>
  );
}

function EquipmentStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen name="EquipmentScreen" component={EquipmentScreen} />
    </Stack.Navigator>
  );
}

function CustomerProfileStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen
        name="CustomerProfileScreen"
        component={CustomerProfileScreen}
      />
    </Stack.Navigator>
  );
}

function TrainerProfileStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Drawer.Screen
        name="TrainerProfileScreen"
        component={TrainerProfileScreen}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      drawerBackgroundColor="red"
      contentContainerStyle={{
        height: '100%',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={props.navigation.toggleDrawer}
        style={{
          position: 'absolute',
          zIndex: 1000000,
          left: 0,
          top: Platform.OS === 'ios' ? 20 : 0,
        }}>
        {/*Donute Button Image */}
        <Image
          source={require('./src/assets/burgerLight.png')}
          style={{
            width: 25,
            height: 25,
            marginLeft: 12,
            marginTop: 20,
          }}
        />
      </TouchableOpacity>
      <DrawerItemList
        {...props}
        labelStyle={{textAlign: 'center', fontSize: 20}}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('None');
  const [role, setRole] = useState(null);
  useEffect(() => {
    RNBootSplash.hide({fade: true});
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bring The Gym Map Permission',
          message: 'Bring The Gym need access to your geolocation ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        if (result === 'granted') {
          console.log(result);
        }
      });
    }
    setActiveUser();
  }, []);

  const setActiveUser = async denied => {
    const token = await AsyncStorage.getItem('token');
    console.log(token, 'token');
    if (token === null) {
      setInitialRouteName('Dashboard');
    } else {
      token ? setUserLoggedIn(true) : setUserLoggedIn(false);
      token
        ? setInitialRouteName('ProfileScreen')
        : setUserLoggedIn('Dashboard');
    }
  };
  if (initialRouteName === 'None') {
    return null;
  }

  auth().onAuthStateChanged(async function (user) {
    if (user) {
      setUserLoggedIn(true);
      database()
        .ref('users/' + user.uid)
        .on('value', snapshot => {
          console.log('snapshot', snapshot);
          if (snapshot.val() !== null) {
            setRole(snapshot._snapshot.value.role || 'customer');
          } else {
            setRole('customer');
          }
        });
    } else {
      setUserLoggedIn(false);
    }
  });

  console.log('role', role);

  return (
    <>
      {userLoggedIn ? (
        <NavigationContainer>
          <Drawer.Navigator
            drawerStyle={{backgroundColor: 'transparent', width: '75%'}}
            screenOptions={{
              ...TransitionPresets.ModalPresentationIOS,
            }}
            drawerContentOptions={{
              activeTintColor: '#9ABDC2',
              inactiveTintColor: '#9ABDC2',
              activeBackgroundColor: '#22191A',
              justifyContent: 'center',
              backgroundColor: '#22191A',
              color: '#9ABDC2',
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              itemsContainerStyle: {
                textAlign: 'center',
                paddingHorizontal: 15,
                justifyContent: 'center',
                alignItems: 'center',
              },
              itemStyle: {
                marginVertical: 5,
                color: '#9ABDC2',
                fontFamily: 'CircularStd-Book',
                justifyContent: 'center',
                textAlign: 'center',
                borderBottomColor: '#9ABDC2',
                borderBottomWidth: 0.5,
                margin: 'auto',
              },
              labelStyle: {
                fontSize: 20,
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
            routeNames={['Dashboard', 'Profile']}
            drawerContent={CustomDrawerContent}>
            {/* <Drawer.Screen
              name="Dashboard"
              options={{
                drawerLabel: 'Dashboard',
                ...TransitionPresets.ScaleFromCenterAndroid,
              }}
              component={DashboardStack}
            /> */}
            {/* {role === 'customer' ? (
              <Drawer.Screen
                name="Trainers"
                options={{drawerLabel: 'Trainers'}}
                component={GetATrainerStack}
              />
            ) : (
              <Drawer.Screen
                name="Clientele"
                options={{drawerLabel: 'Clientele'}}
                component={ClienteleStack}
              />
            )} */}
            <Drawer.Screen name="Equipment" component={EquipmentStack} />
            {role === 'customer' ? (
              <Drawer.Screen
                name="Account"
                options={{drawerLabel: 'Account'}}
                component={CustomerProfileStack}
              />
            ) : (
              <Drawer.Screen
                name="Account"
                options={{drawerLabel: 'Account'}}
                component={TrainerProfileStack}
              />
            )}
            {/* <Drawer.Screen
              name="Profile"
              options={{drawerLabel: 'Profile'}}
              component={ProfileStack}
            /> */}
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="DashboardScreen" component={DashboardLogin} />
            <Stack.Screen
              name="CustomerRegister"
              component={CustomerRegister}
            />
            <Stack.Screen name="TrainerRegister" component={SellerRegister} />
            <Stack.Screen name="AddressScreen" component={AddressScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
