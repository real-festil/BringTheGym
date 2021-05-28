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
import database from '@react-native-firebase/database';
import {collection, doc, setDoc} from 'firebase/firestore';
import {View, TouchableOpacity, Image, Text} from 'react-native';

import Login from './src/Login';
import Signup from './src/SignUp';
import Dashboard from './src/screens/DashboardScreen';
import DashboardLogin from './src/Dashboard';
import CustomerRegister from './src/screens/CustomerRegister';
import SellerRegister from './src/screens/TrainerRegister';

import ProfileScreen from './src/screens/ProfileScreen';
import AddressScreen from './src/screens/AddressScreen';
import GetATrainerScreen from './src/screens/GetATrainerScreen';
import ClienteleScreen from './src/screens/ClienteleScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = props => {
  const toggleDrawer = () => {
    console.log(props);
    props.navigationProps.navigation.toggleDrawer();
  };

  const [userData, setUserData] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [userPhoto, setUserPhoto] = React.useState(null);

  React.useEffect(() => {
    //this.signOut()
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log(userData);
    return subscriber; // unsubscribe on unmount
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
      database()
        .ref('users/' + user.uid)
        .once('value')
        .then(snapshot => {
          setRole(snapshot._snapshot.value.role);
        });
    }
  });

  return (
    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
      {userData && (
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View style={{height: 'auto', justifyContent: 'flex-start'}}>
            <Image
              source={
                userPhoto && userPhoto !== 'null'
                  ? {uri: userPhoto}
                  : require('./src/assets/profile_photo.png')
              }
              style={{
                width: 35,
                height: 35,
                marginRight: 15,
                borderRadius: 50,
              }}
            />
          </View>
          <View>
            <Text style={{fontWeight: 'bold'}}>
              {userData._user.displayName}
            </Text>
            <Text style={{color: '#4E4E4E', textTransform: 'capitalize'}}>
              {role}
            </Text>
          </View>
        </View>
      )}
      {/* <View> */}
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://cdn1.iconfinder.com/data/icons/mixed-17/16/icon_Hamburger_rounded-512.png',
          }}
          style={{width: 25, height: 25, marginLeft: 12, marginTop: 20}}
        />
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

const screenOptions = navigation => ({
  headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
  headerRight: () => (
    <Image
      source={require('./src/assets/logo.jpeg')}
      style={{width: 100, height: 100, marginRight: -10, marginTop: -40}}
    />
  ),
  headerTitle: <></>,
  headerStyle: {
    backgroundColor: '#9abdc1',
    height: 100,
  },
});

function DashboardStack({initialRouteName, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
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
      <Drawer.Screen name="GetATrainerScreen" component={GetATrainerScreen} />
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('None');
  const [role, setRole] = useState(null);
  useEffect(() => {
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
        .once('value')
        .then(snapshot => {
          setRole(snapshot._snapshot.value.role);
        });
    } else {
      setUserLoggedIn(false);
    }
  });

  return (
    <>
      {userLoggedIn ? (
        <NavigationContainer>
          <Drawer.Navigator
            drawerContentOptions={{
              activeTintColor: 'black',
              backgroundColor: '#9abdc1',
              itemStyle: {marginVertical: 5, color: 'black'},
            }}
            routeNames={['Dashboard', 'Profile']}
            drawerContent={CustomDrawerContent}>
            <Drawer.Screen
              name="Dashboard"
              options={{drawerLabel: 'Dashboard'}}
              component={DashboardStack}
            />
            {role === 'customer' ? (
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
            )}
            <Drawer.Screen
              name="Profile"
              options={{drawerLabel: 'Profile'}}
              component={ProfileStack}
            />
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
