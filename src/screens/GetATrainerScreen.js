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
import FindTrainer from '../components/FindTrainer';

const GetATrainerScreen = () => {
  const [trainers, setTrainers] = useState(null);
  const [userTrainers, setUserTrainers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isSearchDisplay, setIsSearchDisplay] = useState(false);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    database()
      .ref('users')
      .once('value')
      .then(snapshot => {
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

  useEffect(() => {
    if (trainers && currentUser && currentUser.trainers) {
      setUserTrainers(
        trainers.filter(trainer =>
          currentUser.trainers
            .map(trainer => trainer.trainerId)
            .includes(trainer.uid),
        ),
      );
    }
  }, [trainers, currentUser]);

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

    if (
      user.trainers &&
      user.trainers.filter(trainer => trainer.trainerId === trainerId).length
    ) {
      const updatedTrainers = user.trainers.filter(
        trainer => trainer.trainerId !== trainerId,
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
          trainers: [...user.trainers, {trainerId, status: 'pending'}],
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
        trainers: [{trainerId, status: 'pending'}],
      });
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Coaches</Text>
        {trainers && (
          <View>
            {userTrainers.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cards}>
                  {currentUser &&
                    userTrainers &&
                    userTrainers.map(trainer => (
                      <TouchableOpacity
                        onPress={() => {
                          setIsModalVisible(true);
                          setSelectedUser(trainer);
                        }}>
                        <View style={{...styles.card}}>
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
                              <Text style={styles.userText}>
                                {trainer.fullName}
                              </Text>
                              <Text> </Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#9ABDC2',
                  borderRadius: 7,
                  padding: 10,
                  height: 150,
                  margin: 15,
                  marginTop: 0,
                }}>
                <Text style={{color: '#9ABDC2', fontSize: 16}}>
                  You have no trainers yet.
                </Text>
              </View>
            )}
          </View>
        )}
        <Text style={styles.title}>Find a Trainer</Text>
        {isSearchDisplay ? (
          <>
            <View
              style={{
                width: '100%',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                paddingHorizontal: 15,
              }}>
              <TouchableOpacity onPress={() => setIsSearchDisplay(false)}>
                <Image
                  source={require('../assets/x.png')}
                  style={{width: 20, height: 20, marginBottom: 10}}
                />
              </TouchableOpacity>
            </View>
            {trainers && (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.cards}>
                    {currentUser &&
                    trainers &&
                    trainers
                      .filter(
                        trainer =>
                          !userTrainers
                            .map(trainer => trainer.uid)
                            .includes(trainer.uid),
                      )
                      .filter(trainer => {
                        if (filters) {
                          if (filters.spec && filters.spec.length > 0) {
                            if (trainer.specialities) {
                              return filters.spec.includes(
                                trainer.specialities,
                              );
                            } else {
                              return;
                            }
                          }
                        }
                        return trainer;
                      })
                      .filter(trainer => {
                        if (filters) {
                          if (filters.qual && filters.qual.length > 0) {
                            if (trainer.qualification) {
                              return filters.qual.includes(
                                trainer.qualification,
                              );
                            } else {
                              return;
                            }
                          }
                        }
                        return trainer;
                      }).length > 0 ? (
                      trainers
                        .filter(
                          trainer =>
                            !userTrainers
                              .map(trainer => trainer.uid)
                              .includes(trainer.uid),
                        )
                        .filter(trainer => {
                          if (filters) {
                            if (filters.spec && filters.spec.length > 0) {
                              if (trainer.specialities) {
                                return filters.spec.includes(
                                  trainer.specialities,
                                );
                              } else {
                                return;
                              }
                            }
                          }
                          return trainer;
                        })
                        .filter(trainer => {
                          if (filters) {
                            if (filters.qual && filters.qual.length > 0) {
                              if (trainer.qualification) {
                                return filters.qual.includes(
                                  trainer.qualification,
                                );
                              } else {
                                return;
                              }
                            }
                          }
                          return trainer;
                        })
                        .map(trainer => (
                          <TouchableOpacity
                            onPress={() => {
                              setIsModalVisible(true);
                              setSelectedUser(trainer);
                            }}>
                            <View style={{...styles.card}}>
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
                                  <Text style={styles.userText}>
                                    {trainer.fullName}
                                  </Text>
                                  <Text> </Text>
                                </View>
                              </ImageBackground>
                            </View>
                          </TouchableOpacity>
                        ))
                    ) : (
                      <Text style={styles.title}>No coaches found</Text>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
          </>
        ) : (
          <FindTrainer
            onSearch={selectedFilters => {
              setFilters(selectedFilters);
              setIsSearchDisplay(true);
            }}
          />
        )}
        {isModalVisible && (
          <TrainerModal
            user={selectedUser}
            isAdded={
              currentUser
                ? currentUser.trainers &&
                  currentUser.trainers.filter(
                    trainer => trainer.trainerId === selectedUser.uid,
                  ).length
                : null
            }
            onAddTrainer={onAddTrainer}
            onClose={() => setIsModalVisible(false)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#22191A',
    position: 'relative',
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
    color: '#9abdc1',
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',

    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 20,
    width: 150,
    height: 200,
    backgroundColor: 'black',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 10,
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
    height: 50,
    backgroundColor: '#c2d8df',
    position: 'absolute',
    bottom: 0,
  },
  userText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'CircularStd-Bold',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
});

export default GetATrainerScreen;
