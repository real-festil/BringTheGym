// components/dashboard.js

import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import TermsModal from '../components/TermsModal';
import LoginFunctions from '../utils/LoginFunction';

const {width, height} = Dimensions.get('window');

const CustomerRegister = props => {
  const [fullName, setFullName] = useState('');

  const [address, setAddress] = useState(null);
  const [date, setDate] = useState(new Date());
  const [userPhoto, setuserPhoto] = useState(null);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [specialities, setSpecialities] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isTermsSelected, setIsTermsSelected] = useState(false);
  const [activeField, setActiveField] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isHeightChanged, setIsHeightChanged] = useState(false);

  const fields = [
    {
      value: email,
      setter: v => validateEmail(v),
      placeholder: 'Email',
      autoCompleteType: 'email',
      errorText: 'Email is not valid',
      errorValue: emailError,
      isRequired: true,
    },
    {
      value: password,
      setter: setPassword,
      placeholder: 'Password (min 6 characters)',
      isSecure: true,
      isRequired: true,
      maxLength: 15,
      minLength: 6,
    },
    {
      value: fullName,
      setter: setFullName,
      placeholder: 'Full Name',
      isRequired: true,
    },
    {
      type: 'address',
      component: (
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
      ),
    },
    {
      type: 'date',
      component: (
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
        </View>
      ),
    },
    {
      value: bio,
      setter: setBio,
      placeholder: 'Bio',
      maxLength: 150,
    },
    {
      value: qualification,
      setter: setQualification,
      placeholder: 'Qualification',
      maxLength: 150,
    },
    {
      value: specialities,
      setter: setSpecialities,
      placeholder: 'Specialities',
      maxLength: 150,
    },
    {
      component: (
        <View style={{width: width - 40}}>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setTelegram(value)}
              value={telegram}
              placeholder={'Telegram'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setWhatsApp(value)}
              value={whatsApp}
              placeholder={'WhatsApp'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setFacebook(value)}
              value={facebook}
              placeholder={'Facebook'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <CheckBox
              value={isTermsSelected}
              onValueChange={setIsTermsSelected}
              boxType="square"
              style={{marginRight: Platform.OS === 'ios' ? 10 : 0}}
            />
            <TouchableOpacity
              style={{height: '100%', marginTop: 10}}
              onPress={() => setIsTermsModalVisible(true)}>
              <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
                I agree to terms and conditions
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.submit} onPress={() => onPrev()}>
              <Text style={styles.textStyle}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submit,
                {backgroundColor: isTermsSelected ? '#21191A' : 'gray'},
              ]}
              onPress={() => (isTermsSelected ? onSubmit() : {})}>
              <Text style={styles.textStyle}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
  ];

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
  const registerUser = async () => {
    if (telegram) {
      const canOpenTg = await Linking.canOpenURL(telegram);
      if (!canOpenTg) {
        Alert.alert('Verify your Telegram link', 'Telegram link is not valid', [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'ok',
          },
        ]);
        return;
      }
    }
    if (whatsApp) {
      const canOpenWa = await Linking.canOpenURL(whatsApp);
      if (!canOpenWa) {
        Alert.alert('Verify your WhatsApp link', 'WhatsApp link is not valid', [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'ok',
          },
        ]);
        return;
      }
    }
    if (facebook) {
      const canOpenFb = await Linking.canOpenURL(facebook);
      if (!canOpenFb) {
        Alert.alert('Verify your Facebook link', 'Facebook link is not valid', [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'ok',
          },
        ]);
        return;
      }
    }

    if (email === '' || password === '' || fullName === '') {
      Alert.alert(
        'Enter details to signup or Login!',
        'Email,Password,Full Name is require',
        [
          {
            text: 'Login',
            onPress: () => props.navigation.navigate('Login'),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else if (telegram === '' && facebook === '' && whatsApp === '') {
      Alert.alert(
        'Enter details to signup or Login!',
        'Telegram, WhatsApp or Facebook is require',
        [
          {
            text: 'Login',
            onPress: () => props.navigation.navigate('Login'),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else {
      try {
        let credential = auth.EmailAuthProvider.credential(email, password);
        return LoginFunctions.registerOrLinkTrainer(
          auth.EmailAuthProvider.PROVIDER_ID,
          credential,
          email,
          fullName,
          address,
          date,
          bio,
          qualification,
          specialities,
          userPhoto,
          telegram,
          whatsApp,
          facebook,
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
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
  const onSubmit = () => {
    registerUser();
  };
  const onChangeDate = selectedDate => {
    console.log(selectedDate, 'date');
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onPrev = () => {
    if (activeField === 0) {
      props.navigation.goBack();
      return;
    }

    if (activeField === fields.length - 1) {
      Animated.timing(buttonsYAnim, {
        toValue: -325,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(buttonsAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsButtonVisible(true);
        Animated.timing(buttonsYAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start();
      });
    }

    Animated.timing(translateXCurrentAnim, {
      toValue: 500,
      duration: 400,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateXPrevAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(translateXCurrentAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateXPrevAnim, {
        toValue: -500,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateXNextAnim, {
        toValue: 500,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setActiveField(activeField - 1);
    });
  };

  const onNext = () => {
    if (fields[activeField].isRequired) {
      if (fields[activeField].value) {
        if (fields[activeField].errorValue) {
          Alert.alert(
            'Error',
            `${fields[activeField].placeholder} is not valid`,
          );
          return;
        }

        if (fields[activeField].minLength) {
          if (
            fields[activeField].value.length < fields[activeField].minLength
          ) {
            Alert.alert(
              'Error',
              `${fields[activeField].placeholder} is too short`,
            );
            return;
          }
        }
        if (activeField === fields.length - 2) {
          setIsButtonVisible(false);
          Animated.timing(buttonsAnim, {
            toValue: -500,
            duration: 400,
            useNativeDriver: true,
          }).start();
          Animated.timing(buttonsYAnim, {
            toValue: -450,
            duration: 0,
            useNativeDriver: true,
          });
        } else {
          setIsButtonVisible(true);
        }
        Animated.timing(translateXPrevAnim, {
          toValue: -500,
          duration: 0,
          useNativeDriver: true,
        }).start();
        Animated.timing(translateXCurrentAnim, {
          toValue: -500,
          duration: 400,
          useNativeDriver: true,
        }).start();
        Animated.timing(translateXNextAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(translateXNextAnim, {
            toValue: 500,
            duration: 0,
            useNativeDriver: true,
          }).start();
          Animated.timing(translateXCurrentAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }).start();
          setActiveField(activeField + 1);
        });
        return;
      } else {
        Alert.alert('Error', `${fields[activeField].placeholder} is required`);
        return;
      }
    }
    if (activeField === fields.length - 2) {
      setIsButtonVisible(false);
      Animated.timing(buttonsYAnim, {
        toValue: -325,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(buttonsAnim, {
        toValue: -500,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      setIsButtonVisible(true);
    }
    Animated.timing(translateXPrevAnim, {
      toValue: -500,
      duration: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateXCurrentAnim, {
      toValue: -500,
      duration: 400,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateXNextAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation ended');
      Animated.timing(translateXNextAnim, {
        toValue: 500,
        duration: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateXCurrentAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
      setActiveField(activeField + 1);
    });
    return;
  };

  const translateXPrevAnim = useRef(new Animated.Value(-500)).current;
  const translateXNextAnim = useRef(new Animated.Value(500)).current;
  const translateXCurrentAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const buttonsYAnim = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: width - 40}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register as Trainer</Text>

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

          <View
            style={{
              position: 'relative',
              height: isButtonVisible ? 75 : 400,
              width: 'auto',
            }}>
            {activeField > 0 &&
              fields
                .filter((_, i) => i === activeField - 1)
                .map((field, index) => (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: [
                        {
                          translateX: translateXPrevAnim,
                        },
                      ],
                    }}
                    key={index}>
                    {field.component ? (
                      field.component
                    ) : (
                      <React.Fragment>
                        <View style={styles.inputItem}>
                          <TextInput
                            style={styles.input}
                            autoCompleteType={field.autoCompleteType}
                            onChangeText={field.setter}
                            value={field.value}
                            placeholder={field.placeholder}
                            placeholderTextColor="rgba(0,0,0, 1)"
                            maxLength={field.maxLength}
                            secureTextEntry={field.isSecure}
                          />
                        </View>
                        {field.errorValue && (
                          <Text style={styles.errorText}>
                            {field.errorText}
                          </Text>
                        )}
                      </React.Fragment>
                    )}
                  </Animated.View>
                ))}

            {fields
              .filter((_, i) => i === activeField)
              .map((field, index) => (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: [
                      {
                        translateX: translateXCurrentAnim,
                      },
                    ],
                  }}
                  key={index}>
                  {field.component ? (
                    field.component
                  ) : (
                    <React.Fragment>
                      <View style={styles.inputItem}>
                        <TextInput
                          style={styles.input}
                          autoCompleteType={field.autoCompleteType}
                          onChangeText={field.setter}
                          value={field.value}
                          placeholder={field.placeholder}
                          placeholderTextColor="rgba(0,0,0, 1)"
                          maxLength={field.maxLength}
                          secureTextEntry={field.isSecure}
                        />
                      </View>
                      {field.errorValue && (
                        <Text style={styles.errorText}>{field.errorText}</Text>
                      )}
                    </React.Fragment>
                  )}
                </Animated.View>
              ))}

            {activeField !== fields.length &&
              fields
                .filter((_, i) => i === activeField + 1)
                .map((field, index) => (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: [
                        {
                          translateX: translateXNextAnim,
                        },
                      ],
                    }}
                    key={index}>
                    {console.log('next component is here')}
                    {field.component ? (
                      field.component
                    ) : (
                      <React.Fragment>
                        <View style={styles.inputItem}>
                          <TextInput
                            style={styles.input}
                            autoCompleteType={field.autoCompleteType}
                            onChangeText={field.setter}
                            value={field.value}
                            placeholder={field.placeholder}
                            placeholderTextColor="rgba(0,0,0, 1)"
                            maxLength={field.maxLength}
                            secureTextEntry={field.isSecure}
                          />
                        </View>
                        {field.errorValue && (
                          <Text style={styles.errorText}>
                            {field.errorText}
                          </Text>
                        )}
                      </React.Fragment>
                    )}
                  </Animated.View>
                ))}
          </View>

          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                position: 'relative',
                zIndex: -1,
                marginTop: isButtonVisible ? 0 : 0,
                transform: [
                  {translateX: buttonsAnim},
                  {translateY: buttonsYAnim},
                ],
              },
            ]}>
            <TouchableOpacity style={styles.submit} onPress={onPrev}>
              <Text style={styles.textStyle}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submit]} onPress={onNext}>
              <Text style={styles.textStyle}>Next</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TermsModal
          visible={isTermsModalVisible}
          onClose={() => setIsTermsModalVisible(false)}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={dateModalVisible}>
          <View style={styles.modalStyle}>
            <DatePicker
              textColor="#000"
              mode="date"
              date={date}
              onDateChange={onChangeDate}
            />
            <TouchableOpacity
              style={styles.submit}
              onPress={() => {
                setDateModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default CustomerRegister;
const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  userImage: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
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
  modalStyle: {
    backgroundColor: '#fff',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 20,
    width: width / 2 - 40,
    display: 'flex',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21191A',
    borderRadius: 25,
    zIndex: 100,
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
