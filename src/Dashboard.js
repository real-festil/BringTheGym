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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../database/fireBase';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const radio_props = [
  {label: 'Customer', value: 0},
  {label: 'Trainer ', value: 1},
];

const {width, height} = Dimensions.get('window');
export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      user: null,
    };
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        AsyncStorage.setItem('Login', JSON.stringify(false));
        this.props.navigation.navigate('Login');
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

  componentDidMount() {
    const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);

    return subscriber;
  }
  onAuthStateChanged(user) {
    // console.log(user, 'after register login page')
    if (user) {
      this.props.navigation.navigate('Dashboard');
    }
  }
  onCheck = value => {
    this.setState({
      value: value,
    });
  };
  onSubmit = () => {
    if (this.state.value === 1) {
      this.props.navigation.navigate('TrainerRegister');
    } else {
      this.props.navigation.navigate('CustomerRegister');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please select a role</Text>

        <RadioForm
          style={{justifyContent: 'space-between', height: 90}}
          radio_props={radio_props}
          initial={this.state.value}
          onPress={value => this.onCheck(value)}
          buttonColor={'#21191A'}
          selectedButtonColor={'#21191A'}
        />

        <TouchableOpacity style={styles.submit} onPress={this.onSubmit}>
          <Text style={styles.textStyle}>Submit</Text>
        </TouchableOpacity>
        {/*<Button*/}
        {/*  color="#3740FE"*/}
        {/*  title="Logout"*/}
        {/*  onPress={() => this.signOut()}*/}
        {/*/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    top: 100,
  },
  container: {
    flex: 1,
    display: 'flex',
    paddingTop: Platform.OS === 'ios' ? 150 : 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 35,
    backgroundColor: 'rgb(155,188,195)',
  },
  title: {
    width: '100%',
    fontSize: 24,
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
    color: '#98B2B6',
    fontSize: 17,
  },
});
