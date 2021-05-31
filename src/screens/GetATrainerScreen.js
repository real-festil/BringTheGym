import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import TrainerModal from '../components/TrainerModal';

const GetATrainerScreen = () => {
  const [trainers, setTrainers] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        console.log();
        setTrainers(
          Object.values(snapshot._snapshot.value)
            .map((user, index) => ({
              ...user,
              uid: Object.keys(snapshot.val())[index],
            }))
            .filter(user => user.role === 'trainer'),
        );
      });
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  }, []);

  const onAddTrainer = async id => {
    const trainerId = trainers.find(trainer => trainer.uid === id).uid;
    console.log('id', id);
    console.log('trainerId', trainerId);

    let user;
    await database()
      .ref('users/' + currentUserId + '/')
      .once('value')
      .then(snapshot => {
        user = snapshot.val();
      });

    if (user.trainers && user.trainers.includes(trainerId)) {
      const updatedTrainers = user.trainers.filter(
        trainer => trainer !== trainerId,
      );
      await database()
        .ref('users/' + currentUserId + '/')
        .update({
          trainers: updatedTrainers,
        });
      database()
        .ref('users/' + currentUserId)
        .once('value', snapshot => {
          setCurrentUser(snapshot.val());
        });
      return;
    }

    if (user.trainers) {
      await database()
        .ref('users/' + currentUserId + '/')
        .update({
          trainers: [...user.trainers, trainerId],
        });
      database()
        .ref('users/' + currentUserId)
        .once('value', snapshot => {
          setCurrentUser(snapshot.val());
        });
      return;
    }

    await database()
      .ref('users/' + currentUserId + '/')
      .update({
        trainers: [trainerId],
      });
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  };

  return (
    <View style={styles.container}>
      {trainers && (
        <ScrollView>
          <View style={styles.cards}>
            {trainers.map(trainer => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true);
                  setSelectedUser(trainer);
                }}>
                <View style={{...styles.card}}>
                  {currentUser.trainers &&
                    currentUser.trainers.includes(trainer.uid) && (
                      <Image
                        style={styles.badge}
                        source={require('../assets/galka.png')}
                      />
                    )}

                  <ImageBackground
                    style={styles.userImage}
                    source={
                      trainer.userPhoto !== 'none'
                        ? {
                            uri: trainer.userPhoto,
                          }
                        : {
                            uri: 'https://www.levistrauss.com/wp-content/uploads/2020/05/Black_Box.png',
                          }
                    }>
                    <View style={styles.textContainer}>
                      <Text style={styles.userText}>{trainer.fullName}</Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {isModalVisible && (
        <TrainerModal
          user={selectedUser}
          isAdded={
            currentUser
              ? currentUser.trainers &&
                currentUser.trainers.includes(selectedUser.uid)
              : null
          }
          onAddTrainer={onAddTrainer}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#9abdc1',
    position: 'relative',
    paddingTop: 10,
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 20,
    width: 170,
    height: 200,
    backgroundColor: 'red',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  badge: {
    position: 'absolute',
    width: 70,
    height: 70,
    zIndex: 100,
    left: 0,
    top: 0,
  },
  textContainer: {
    width: '100%',
    height: 40,
    backgroundColor: '#c2d8df',
    position: 'absolute',
    bottom: 0,
  },
  userText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 10,
    fontFamily: 'CircularStd-Bold',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
});

export default GetATrainerScreen;
