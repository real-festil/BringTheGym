// components/login.js

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GoogleSignin} from '@react-native-community/google-signin';
import LoginFunctions from './utils/LoginFunction';
const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      userData: '',
      token: null,
      password: '',
      user: null,
      isLoading: false,
      isLogged: false,
      userInfo: [],
    };
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  async componentDidMount() {
    GoogleSignin.configure({
      scopes: ['email', 'profile'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '74892996588-fjad3bjk6q2dp97k0032bm8fm1dqchpr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '74892996588-3nav280jh0ddsma78lo5g4h7brqlq7vl.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    if (this.state.user) {
      auth().signOut();
    }
    this.setState({
      isLoading: false,
    });
    const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }

  onAuthStateChanged(user) {
    // console.log(user, 'after register login page')
    if (user) {
      this.setState({
        user: user,
        isLoading: false,
      });
      this.props.navigation.navigate('Dashboard');
    } else {
      this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate('Login');
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  // Somewhere in your code
  signInGoogle = async () => {
    try {
      const data = await GoogleSignin.signIn();
      let credential = auth.GoogleAuthProvider.credential(data.idToken);
      // this.setState({
      //   isLoading: true,
      // })
      return LoginFunctions.signInOrLink(
        auth.GoogleAuthProvider.PROVIDER_ID,
        credential,
        data.user.email,
      );
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      console.log(error.message);
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userInfo: null}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  setLoading = () => {
    this.setState({isLoading: false});
  };
  signInFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        console.log('User cancelled the login process');
        return;
      }

      let credential;
      // this.setState({
      //   isLoading: true,
      // })
      const _responseInfoCallback = (error, result) => {
        if (error) {
          console.log(error.message);
        } else {
          return LoginFunctions.signInOrLink(
            auth.FacebookAuthProvider.PROVIDER_ID,
            credential,
            result.email,
          );
        }
      };

      let token = await AccessToken.getCurrentAccessToken();
      if (!token) {
        throw 'Something went wrong obtaining access token';
      }
      credential = auth.FacebookAuthProvider.credential(token.accessToken);

      const infoRequest = new GraphRequest(
        '/me?fields=name,email',
        null,
        _responseInfoCallback,
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      console.log(error.message);
    }
  };
  userLogin = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!');
    } else {
      try {
        let credential = auth.EmailAuthProvider.credential(
          this.state.email,
          this.state.password,
        );
        return LoginFunctions.signInOrLink(
          auth.EmailAuthProvider.PROVIDER_ID,
          credential,
          this.state.email,
        );
      } catch (error) {
        console.log(error);
        console.log('Login details not recognised');
      }
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={{width: width - 70}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrapper}>
            <Image
              style={{width: 120, height: 120, marginRight: -20}}
              source={require('../src/assets/logo.jpeg')}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
              marginBottom: 80,
            }}>
            <Text
              style={{
                fontSize: 44,
                fontFamily:
                  Platform.OS === 'ios' ? 'ArialHebrew-Bold' : 'Anton-Regular',
              }}>
              {' '}
              BringTheGym
            </Text>
          </View>

          <TextInput
            style={styles.inputStyle}
            placeholderTextColor="rgba(0,0,0, 0.5)"
            placeholder="Email"
            value={this.state.email}
            onChangeText={val => this.updateInputVal(val, 'email')}
          />
          <TextInput
            style={styles.inputStyle}
            placeholderTextColor="rgba(0,0,0, 0.5)"
            placeholder="Password"
            value={this.state.password}
            onChangeText={val => this.updateInputVal(val, 'password')}
            maxLength={15}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.userLogin()}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('DashboardScreen')}>
            <Text style={styles.loginText}>
              {' '}
              Don't have account? Click here to signup
            </Text>
          </TouchableOpacity>

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => this.signInGoogle()}>
                <Image
                  style={styles.tinyLogo}
                  source={require('./assets/google.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => this.signInFacebook()}>
                <Image
                  style={styles.tinyLogo}
                  source={require('./assets/facebook.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 35,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'rgb(155,188,195)',
  },
  logoWrapper: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 0,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    padding: 13,
    backgroundColor: '#BBD5DA',
    borderRadius: 25,
    fontSize: 17,
  },
  loginBtn: {
    textAlign: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#21191A',
    borderRadius: 25,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
  },
  loginText: {
    color: '#000',
    marginTop: 25,

    opacity: 0.5,
    textAlign: 'center',
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
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 80,
    paddingRight: 80,
    marginTop: 50,
  },
  googleBtn: {},
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
