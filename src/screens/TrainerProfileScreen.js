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
import moment from 'moment';

const TrainerProfileScreen = props => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  }, [currentUserId]);

  const signOut = () => {
    auth().signOut();
  };

  console.log('currentUser', currentUser);

  return (
    <View style={styles.container}>
      {currentUser && (
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
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
              <Text style={styles.fullName}>{currentUser.fullName}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Bio</Text>
              <Text style={styles.info}>{currentUser.bio}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Email</Text>
              <Text style={styles.info}>{currentUser.email}</Text>
            </View>
            {currentUser.birthday && (
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Birthday</Text>
                <Text style={styles.info}>
                  {moment(currentUser.birthday).format('DD.MM.YYYY')}
                </Text>
              </View>
            )}
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Specialities</Text>
              <Text style={styles.info}>{currentUser.specialities}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.subtitle}>Qualification</Text>
              <Text style={styles.info}>{currentUser.qualification}</Text>
            </View>
            {currentUser.telegram && currentUser.telegram.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Telegram</Text>
                <Text style={styles.info}>{currentUser.telegram}</Text>
              </View>
            )}
            {currentUser.whatsApp && currentUser.whatsApp.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>WhatsApp</Text>
                <Text style={styles.info}>{currentUser.whatsApp}</Text>
              </View>
            )}
            {currentUser.facebook && currentUser.facebook.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.subtitle}>Facebook</Text>
                <Text style={styles.info}>{currentUser.facebook}</Text>
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
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>Edit info</Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
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
    fontFamily: 'CircularStd-Bold',
    color: '#9ABDC2',
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
    justifyContent: 'center',
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
    color: '#22191A',
    fontFamily: 'CircularStd-Bold',
  },
});

export default TrainerProfileScreen;
