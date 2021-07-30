import React, {useRef, useEffect} from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const TrainerModal = ({user, onClose, onAddTrainer, isAdded, status}) => {
  const {fullName, bio, email, qualification, specialities, userPhoto, uid} =
    user;

  console.log('status', status);

  const userStatus = status && status.status ? status.status : '';

  useEffect(() => {
    openAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = useRef(new Animated.Value(700)).current;

  const openAnimation = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(translateY, {
      toValue: 700,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onCloseHandler = () => {
    fadeOut();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 150,
  };

  const openLink = async url => {
    const supported = await Linking.canOpenURL(url);
    console.log('url', url);
    console.log('supported', supported);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer
        config={config}
        onSwipeDown={state => onCloseHandler()}>
        <Modal transparent animationType="fade">
          <View style={styles.backdrop}>
            <TouchableOpacity
              style={{width: '100%', height: '100%'}}
              onPress={onCloseHandler}
            />
          </View>
          <Animated.View
            useNativeD
            style={[styles.modal, {transform: [{translateY}]}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Trainer</Text>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.userImage}
                  source={
                    userPhoto !== 'none'
                      ? {
                          uri: userPhoto,
                        }
                      : require('../assets/profile_photo.png')
                  }
                />
                <Text style={styles.fullName}>{fullName}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Bio</Text>
                <Text style={styles.info}>{bio}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Email</Text>
                <Text style={styles.info}>{email}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Qualifications</Text>
                <Text style={styles.info}>{qualification}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Specialties</Text>
                <Text style={styles.info}>{specialities}</Text>
              </View>
              {userStatus === 'accepted' && (
                <>
                  <Text
                    style={[
                      styles.subtitle,
                      {paddingHorizontal: 30, marginTop: 10},
                    ]}>
                    Contact Trainer
                  </Text>
                  <View style={styles.contact}>
                    {user.telegram.length > 0 && (
                      <TouchableOpacity onPress={() => openLink(user.telegram)}>
                        <Image
                          style={styles.contactIcon}
                          source={require('../assets/telegram.png')}
                        />
                      </TouchableOpacity>
                    )}
                    {user.whatsApp.length > 0 && (
                      <TouchableOpacity onPress={() => openLink(user.whatsApp)}>
                        <Image
                          style={styles.contactIcon}
                          source={require('../assets/whatsapp.png')}
                        />
                      </TouchableOpacity>
                    )}
                    {user.facebook.length > 0 && (
                      <TouchableOpacity onPress={() => openLink(user.facebook)}>
                        <Image
                          style={styles.contactIcon}
                          source={require('../assets/facebookIcon.png')}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
              <View
                style={{
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        userStatus === 'pending' ? '#748e91' : '#9ABDC2',
                    },
                  ]}
                  onPress={() =>
                    userStatus === 'pending' ? {} : onAddTrainer(uid)
                  }>
                  <Text style={styles.buttonText}>
                    {userStatus === 'pending'
                      ? 'In review'
                      : userStatus === 'accepted'
                      ? 'Unsubscribe'
                      : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Modal>
      </GestureRecognizer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#22191A',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '100%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
  },
  fullName: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    color: '#9ABDC2',
    fontSize: 18,
  },
  infoBlock: {
    paddingHorizontal: 30,
    paddingVertical: 7,
    // borderBottomColor: '#ade0db',
    // borderBottomWidth: 1,
  },
  userImage: {
    width: 100,
    height: 100,
    display: 'flex',
    borderRadius: 1000,
    marginTop: 10,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
  },
  info: {
    fontSize: 16,
    fontFamily: 'CircularStd-Book',
    color: '#9ABDC2',
    marginTop: 10,
  },
  button: {
    width: '90%',
    backgroundColor: '#9ABDC2',
    height: 50,
    marginVertical: 10,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontFamily: 'CircularStd-Bold',
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 30,
  },
  contactIcon: {
    width: 40,
    height: 40,
  },
});

export default TrainerModal;
