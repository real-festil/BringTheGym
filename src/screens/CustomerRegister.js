// components/dashboard.js

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  Platform,
  Picker,
  Image,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firebase from '../../database/fireBase';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import LoginFunctions from '../utils/LoginFunction';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const CustomerRegister = props => {
  const [isLogged, setIsLogged] = useState('');

  const [errorMessage, setErrorMesasge] = useState('');
  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');

  const [address, setAddress] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [userPhoto, setuserPhoto] = useState(null);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [weight, setWeight] = useState(null);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [height, setHeight] = useState(null);
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [train, setTrain] = useState('');
  const [trainModalVisible, setTrainModalVisible] = useState(false);
  const [bio, setBio] = useState(null);
  const [goals, setGoals] = useState(null);

  function onAuthStateChanged(user) {
    if (user) {
      props.navigation.navigate('Dashboard');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const validateEmail = email => {
    console.log(email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      console.log('Email is Not Correct');
      setEmailError(true);
      setEmail(email);
      return false;
    } else {
      setEmailError(false);
      setEmail(email);
      console.log('Email is Correct');
    }
  };
  const registerUser = () => {
    if (email === '' || password === '') {
      Alert.alert('Enter details to signup or Login!', '', [
        {
          text: 'Login',
          onPress: () => props.navigation.navigate('Login'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    } else {
      try {
        let credential = auth.EmailAuthProvider.credential(email, password);
        return LoginFunctions.registerOrLink(
          auth.EmailAuthProvider.PROVIDER_ID,
          credential,
          email,
          fullName,
          address,
          date,
          weight,
          height,
          train,
          bio,
          goals,
          userPhoto,
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const onSubmit = () => {
    registerUser();
  };
  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 100,
      height: 100,
      cropping: true,
    }).then(image => {
      console.log(image, 'image');
      setuserPhoto({
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime,
        sourceURL: image.sourceURL,
      });
      console.log(userPhoto, 'photo');
    });
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateModalVisible(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const renderWeight = Array.from({length: 300}, (x, i) => i.toString());

  const onWeightChange = weight => {
    setWeight(weight);
  };
  const onHeightChange = height => {
    setHeight(height);
  };
  const onTrainChange = value => {
    setTrain(value);
  };
  console.log(Platform.OS, '');

  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: width - 40}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register as Customer</Text>

        <View style={styles.wrapper}>
          <View style={styles.inputItem}>
            <TouchableOpacity
              style={styles.userImage}
              onPress={() => selectPhoto()}>
              <Image
                style={{width: 100, height: 100, resizeMode: 'contain'}}
                source={
                  userPhoto ? userPhoto : require('../assets/profile_photo.png')
                }
              />
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              autoCompleteType={'email'}
              onChangeText={value => validateEmail(value)}
              value={email}
              placeholder={'Email'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>Email is not valid</Text>
          )}
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0,0,0, 1)"
              value={password}
              onChangeText={val => setPassword(val)}
              maxLength={15}
              secureTextEntry={true}
              placeholder={'Password(min 6 characters)'}
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={100}
              placeholderTextColor="rgba(0,0,0, 1)"
              onChangeText={value => setFullName(value)}
              value={fullName}
              placeholder={'Full Name'}
            />
          </View>
          <View style={styles.inputItem}>
            <TouchableOpacity
              style={{
                backgroundColor: '#BBD5DA',
                fontSize: 17,
                borderRadius: 15,
                width: width - 40,
              }}
              onPress={() =>
                props.navigation.navigate('AddressScreen', {
                  setAddress: setAddress,
                })
              }>
              <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                {address ? address : 'Address'}
              </Text>
            </TouchableOpacity>
          </View>

          {Platform.OS == 'android' ? (
            <View style={styles.inputItem}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BBD5DA',
                  fontSize: 17,
                  borderRadius: 15,
                  width: width - 40,
                }}
                onPress={() => setDateModalVisible(true)}>
                <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                  {date ? moment(date).format('MM DD YYYY') : 'Birthday'}
                </Text>
              </TouchableOpacity>

              {dateModalVisible && (
                <DateTimePicker
                  textColor="#000"
                  style={styles.input}
                  value={date}
                  display="spinner"
                  onChange={onChangeDate}
                />
              )}
            </View>
          ) : (
            <View style={styles.inputItem}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BBD5DA',
                  fontSize: 17,
                  borderRadius: 15,
                  width: width - 40,
                }}
                onPress={() => setDateModalVisible(true)}>
                <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                  {date ? moment(date).format('MM DD YYYY') : 'Birthday'}
                </Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={dateModalVisible}
                onRequestClose={() => {
                  setDateModalVisible(!dateModalVisible);
                }}>
                <View style={styles.modalStyle}>
                  <DateTimePicker
                    textColor="#000"
                    style={styles.input}
                    value={date}
                    display="spinner"
                    onChange={onChangeDate}
                  />
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

          {Platform.OS == 'android' ? (
            <View style={styles.inputItem}>
              <View
                style={{
                  backgroundColor: '#BBD5DA',
                  borderRadius: 15,
                  width: width - 40,
                }}>
                <Picker
                  style={{
                    color: '#000',
                    fontSize: 17,
                    padding: 14,
                    width: width - 50,
                  }}
                  open={true}
                  selectedValue={weight}
                  onValueChange={value => onWeightChange(value)}>
                  {renderWeight.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item == 0 ? 'Weight (kg)' : item + ' kg'}
                        value={index}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          ) : (
            <View style={styles.inputItem}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BBD5DA',
                  fontSize: 17,
                  borderRadius: 15,
                  width: width - 40,
                }}
                onPress={() => setWeightModalVisible(true)}>
                <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                  {weight ? weight + ' kg' : 'Weight (kg)'}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={weightModalVisible}
                onRequestClose={() => {
                  setWeightModalVisible(!weightModalVisible);
                }}>
                <View style={styles.modalStyle}>
                  <Picker
                    style={{color: '#000', padding: 13, width: width}}
                    mode="dropdown"
                    selectedValue={weight}
                    onValueChange={value => onWeightChange(value)}>
                    {renderWeight.map((item, index) => {
                      return (
                        <Picker.Item label={item} value={index} key={index} />
                      );
                    })}
                  </Picker>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => setWeightModalVisible(false)}>
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

          {Platform.OS == 'android' ? (
            <View style={styles.inputItem}>
              <View
                style={{
                  backgroundColor: '#BBD5DA',
                  borderRadius: 15,
                  width: width - 40,
                }}>
                <Picker
                  style={{
                    color: '#000',
                    fontSize: 17,
                    padding: 14,
                    width: width - 50,
                  }}
                  open={true}
                  selectedValue={height}
                  onValueChange={value => onHeightChange(value)}>
                  {renderWeight.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item == 0 ? 'Height (cm)' : item + ' cm'}
                        value={index}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
          ) : (
            <View style={styles.inputItem}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BBD5DA',
                  fontSize: 17,
                  borderRadius: 15,
                  width: width - 40,
                }}
                onPress={() => setHeightModalVisible(true)}>
                <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                  {height ? height + ' cm' : 'Height (cm)'}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={heightModalVisible}
                onRequestClose={() => {
                  setHeightModalVisible(!heightModalVisible);
                }}>
                <View style={styles.modalStyle}>
                  <Picker
                    style={{color: '#000', padding: 13, width: width}}
                    mode="dropdown"
                    selectedValue={height}
                    onValueChange={value => onHeightChange(value)}>
                    {renderWeight.map((item, index) => {
                      return (
                        <Picker.Item label={item} value={index} key={index} />
                      );
                    })}
                  </Picker>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => setHeightModalVisible(false)}>
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

          {Platform.OS == 'android' ? (
            <View style={styles.inputItem}>
              <View
                style={{
                  backgroundColor: '#BBD5DA',
                  borderRadius: 15,
                  width: width - 40,
                }}>
                <Picker
                  style={{
                    color: '#000',
                    width: width - 50,
                    fontSize: 17,
                    padding: 14,
                  }}
                  selectedValue={train}
                  onValueChange={value => onTrainChange(value)}>
                  <Picker.Item
                    label={'How much do you train?'}
                    value={''}
                    key={0}
                  />
                  <Picker.Item
                    label={'Not at all'}
                    value={'Not at all'}
                    key={0}
                  />
                  <Picker.Item label={'A little'} value={'A little'} key={1} />
                  <Picker.Item
                    label={'Sometimes'}
                    value={'Sometimes'}
                    key={2}
                  />
                </Picker>
              </View>
            </View>
          ) : (
            <View style={styles.inputItem}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BBD5DA',
                  fontSize: 17,
                  borderRadius: 15,
                  width: width - 40,
                }}
                onPress={() => setTrainModalVisible(true)}>
                <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                  {train ? train : 'How much do you train?'}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={trainModalVisible}
                onRequestClose={() => {
                  setTrainModalVisible(!trainModalVisible);
                }}>
                <View style={styles.modalStyle}>
                  <Picker
                    style={{color: '#000', width: width}}
                    selectedValue={train}
                    onValueChange={value => onTrainChange(value)}>
                    <Picker.Item
                      label={'Not at all'}
                      value={'Not at all'}
                      key={0}
                    />
                    <Picker.Item
                      label={'A little'}
                      value={'A little'}
                      key={1}
                    />
                    <Picker.Item
                      label={'Sometimes'}
                      value={'Sometimes'}
                      key={2}
                    />
                  </Picker>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => setTrainModalVisible(false)}>
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setBio(value)}
              value={bio}
              placeholder={'Bio'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>

          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={300}
              multiline={true}
              onChangeText={value => setGoals(value)}
              value={goals}
              placeholder={'Goals'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => props.navigation.goBack()}>
            <Text style={styles.textStyle}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submit} onPress={() => onSubmit()}>
            <Text style={styles.textStyle}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 25,
    color: '#fff',
  },
  container: {
    flex: 1,
    display: 'flex',
    paddingTop: Platform.OS === 'ios' ? 100 : 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: 'rgb(155,188,195)',
  },
  title: {
    width: '100%',
    fontSize: 27,
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  wrapper: {
    width: '100%',
  },
  inputItem: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioForm: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'column',
    marginTop: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  radioWrapper: {
    width: '100%',
  },
  inputTitle: {
    width: '30%',
    fontSize: 17,
  },
  input: {
    padding: 13,
    width: '100%',
    backgroundColor: '#BBD5DA',
    fontSize: 17,
    borderRadius: 15,
  },

  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  submit: {
    marginTop: 30,
    width: width / 2 - 40,
    display: 'flex',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21191A',
    borderRadius: 25,
  },
  modalStyle: {
    backgroundColor: '#fff',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textTransform: 'uppercase',
    fontWeight: '500',
    color: '#98B2B6',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
export default CustomerRegister;
