import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import React, {useState, useEffect} from 'react';
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
import EditInfoModal from '../components/EditInfoModal';
import TermsModal from '../components/TermsModal';

const CustomerProfileScreen = props => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const currentUserId = auth().currentUser.uid;

  const signOut = () => {
    auth().signOut();
  };


  useEffect(() => {
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        if(snapshot.val()) {
          console.log('this one call')
          setCurrentUser(snapshot.val());
        } else {
          setCurrentUser(auth().currentUser);
          // setCurrentUser({...currentUser, fullName: auth().currentUser.displayName, userPhoto: 'none'})
          console.log('snapshot23', currentUser)
        }
      });
  }, [currentUserId, isModalVisible]);

  console.log('userPgoto', currentUser)

  return (
    <View style={styles.container}>
      {currentUser && (
        <View style={styles.modal}>
          <ScrollView>
            <View style={styles.imageContainer}>
              {currentUser.userPhoto ? (

                <Image
                style={styles.userImage}
                source={
                  currentUser.userPhoto !== 'none'
                  ? {
                    uri: currentUser.userPhoto,
                  }
                  : require('../assets/profile_photo.png')
                }
                />
                ) : (
                  <Image
                style={styles.userImage}
                source={
                  require('../assets/profile_photo.png')
                }
                />
                )}
              <Text style={styles.fullName}>{currentUser.fullName || currentUser.displayName}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Bio</Text>
              <Text style={styles.info}>{currentUser.bio || 'You have no bio yet'}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Email</Text>
              <Text style={styles.info}>{currentUser.email}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Weight</Text>
              <Text style={styles.info}>{currentUser.weight ? currentUser.weight + 'kg' : 'Set your weight'}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Height</Text>
              <Text style={styles.info}>{currentUser.height ? currentUser.height + 'cm' : 'Set your height'}</Text>
            </View>
            {currentUser.train ? (
              <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>How often customer train</Text>
              <Text style={styles.info}>{currentUser.train}</Text>
            </View>
            ) : <></>}
            {currentUser.goals && (
              <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Goals</Text>
              <Text style={styles.info}>{currentUser.goals}</Text>
            </View>
            )}
            <TermsModal
              visible={isTermsModalVisible}
              onClose={() => setIsTermsModalVisible(false)}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 30,
              }}>
              <TouchableOpacity
                style={{height: '100%', marginTop: 10}}
                onPress={() => setIsTermsModalVisible(true)}>
                <Text
                  style={{
                    fontSize: 18,
                    textDecorationLine: 'underline',
                    color: '#9ABDC2',
                  }}>
                  Terms and conditions
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsBlock}>
              <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>Edit info</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {isModalVisible && (
            <EditInfoModal
              user={currentUser}
              currentUserId={currentUserId}
              onClose={() => setIsModalVisible(false)}
              navigation={props.navigation}
              isNew={!currentUser.fullName}
            />
          )}
        </View>
      )}
    </View>
  );
};

{
  /* <View style={styles.backdrop}>
            <TouchableOpacity
              style={{width: '100%', height: '100%'}}
              onPress={onCloseHandler}
            />
          </View> */
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    top: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#22191A',
    width: '100%',
    height: '100%',
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'CircularStd-Bold',
    color: '#9ABDC2',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'CircularStd-Bold',
    color: '#9ABDC2',
  },
  fullName: {
    textAlign: 'center',
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    marginTop: 10,
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
  buttonsBlock: {
    paddingHorizontal: 30,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '40%',
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
    color: '#22191A',
    fontFamily: 'CircularStd-Bold',
  },
});

export default CustomerProfileScreen;
