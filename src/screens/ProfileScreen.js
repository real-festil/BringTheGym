// components/dashboard.js

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../database/fireBase';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('window');

export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      user: null,
      profileData: null,
      userImage: null,
      withoutPhoto: false,
    };
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  signOut = () => {
    auth().signOut();
    this.props.navigation.navigate('Login');
  };
  componentDidMount() {
    //this.signOut()
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.profileData) {
      return true;
    }
  };
  onAuthStateChanged(user) {
    if (user) {
      this.setState({
        user: user,
      });
      database()
        .ref('users/' + user.uid)
        .once('value')
        .then(snapshot => {
          //console.log('User data: ', snapshot.val());
          if (snapshot.val() !== null) {
            this.setState({
              profileData: snapshot.val(),
            });
            //console.log(snapshot.val().userPhoto,'snapshot.val().userPhoto')
            if (
              snapshot.val().userPhoto !== 'none' &&
              !snapshot.val().userPhoto
            ) {
              console.log('no image');
              this.onAuthStateChanged(user);
            }
          } else {
            this.setState({
              profileData: user,
            });
            console.log(user, 'user not register');
          }
        })
        .catch(error => console.log(error, 'user Data error'));
    }
    if (!user) {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    // if (this.state.isLoading) {
    //   return (
    //       <View style={styles.preloader}>
    //         <ActivityIndicator size="large" color="#9E9E9E" />
    //       </View>
    //   )
    // }

    return (
      <View style={styles.container}>
        {(this.state.profileData &&
          this.state.profileData.userPhoto &&
          this.state.profileData.userPhoto !== 'none') ||
        (this.state.profileData && this.state.profileData.photoURL) ? (
          <View style={styles.userImage}>
            <Image
              source={{
                uri: this.state.profileData.userPhoto
                  ? this.state.profileData.userPhoto
                  : this.state.profileData.photoURL,
              }}
              width={100}
              height={100}
              style={{borderRadius: 100, width: 100, height: 100}}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.userImage}
            onPress={() => selectPhoto()}>
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={require('../assets/profile_photo.png')}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>
          {this.state.profileData
            ? this.state.profileData.fullName
              ? this.state.profileData.fullName
              : this.state.profileData.displayName
            : ''}
        </Text>
        <Text style={styles.textStyle}>
          {this.state.profileData ? this.state.profileData.email : ''}
        </Text>
        {/*<Text style={styles.textStyle}>{this.state.profileData ? this.state.profileData.role : ''}</Text>*/}

        <TouchableOpacity style={styles.logout} onPress={() => this.signOut()}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  userImage: {
    marginBottom: 20,
  },
  logout: {
    width: width - 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    backgroundColor: '#21191A',
    borderRadius: 50,
  },
  textLogout: {
    color: '#fff',
    fontSize: 15,
  },
  container: {
    flex: 1,
    display: 'flex',
    paddingTop: Platform.OS === 'ios' ? 130 : 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#9abdc1',
  },
  title: {
    width: '100%',
    fontSize: 20,
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  submit: {
    marginTop: 30,
    width: width - 70,
    display: 'flex',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21191A',
    borderRadius: 25,
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: 15,
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
