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
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const CustomerModal = ({user, onClose}) => {
  const {fullName, bio, email, weight, height, userPhoto, goals, train} = user;

  console.log(user);

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

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 150,
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
              <Text style={styles.title}>Customer</Text>
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
                <Text style={styles.subtitle}>Weight</Text>
                <Text style={styles.info}>{weight}kg</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Height</Text>
                <Text style={styles.info}>{height}cm</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>How often customer train</Text>
                <Text style={styles.info}>{train}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Goals</Text>
                <Text style={styles.info}>{goals}</Text>
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
    fontFamily: 'CircularStd-Bold',
    color: '#9ABDC2',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
  },
  fullName: {
    textAlign: 'center',
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
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
    marginTop: 10,
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Book',
  },
  orderButton: {
    borderWidth: 1,
    borderColor: '#9ABDC2',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    width: 90,
  },
  orderText: {
    color: '#9ABDC2',
    textAlign: 'center',
  },
});

export default CustomerModal;
