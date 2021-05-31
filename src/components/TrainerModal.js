import React, {useRef, useEffect} from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const TrainerModal = ({user, onClose, onAddTrainer, isAdded}) => {
  const {fullName, bio, email, qualification, specialities, userPhoto, uid} =
    user;

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
    }, 200);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} onPress={onCloseHandler} />
      <Animated.View
        useNativeD
        style={[styles.modal, {transform: [{translateY}]}]}>
        <ScrollView>
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
          <View
            style={{
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onAddTrainer(uid)}>
              <Text style={styles.buttonText}>
                {isAdded ? 'Unsubscribe' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#9abdc1',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '90%',
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'CircularStd-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'CircularStd-Bold',
  },
  fullName: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
  infoBlock: {
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderBottomColor: '#ade0db',
    borderBottomWidth: 1,
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
    marginTop: 10,
  },
  button: {
    width: '90%',
    backgroundColor: 'black',
    height: 50,
    marginVertical: 10,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontFamily: 'CircularStd-Bold',
  },
});

export default TrainerModal;
