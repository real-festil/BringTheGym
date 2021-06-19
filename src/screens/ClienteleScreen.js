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
import CustomerModal from '../components/CustomerModal';

const ClienteleScreen = () => {
  const [customers, setCustomers] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        console.log('snapshot', Object.keys(snapshot.val()));
        setCustomers(
          Object.values(snapshot._snapshot.value)
            .map((user, index) => ({
              ...user,
              uid: Object.keys(snapshot.val())[index],
            }))
            .filter(user => user.role === 'customer')
            .filter(user => user.trainers)
            .filter(user =>
              user.trainers
                .map(trainer => trainer.trainerId)
                .includes(currentUserId),
            ),
        );
      });
    database()
      .ref('users/' + currentUserId)
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  }, []);

  const onStatusChange = async (id, status) => {
    console.log(id);
    let user;
    await database()
      .ref('users/' + id + '/')
      .once('value')
      .then(snapshot => {
        user = snapshot.val();
      });

    user = {
      ...user,
      trainers: user.trainers.map(trainer => {
        if (trainer.trainerId === currentUserId) {
          return {...trainer, status};
        }
        return trainer;
      }),
    };

    console.log('user.trainers', user.trainers);

    await database()
      .ref('users/' + id + '/')
      .update({
        trainers: user.trainers,
      });

    database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        console.log('snapshot', Object.keys(snapshot.val()));
        setCustomers(
          Object.values(snapshot._snapshot.value)
            .map((user, index) => ({
              ...user,
              uid: Object.keys(snapshot.val())[index],
            }))
            .filter(user => user.role === 'customer')
            .filter(user => user.trainers)
            .filter(user =>
              user.trainers
                .map(trainer => trainer.trainerId)
                .includes(currentUserId),
            ),
        );
      });

    // if (
    //   user.trainers &&
    //   user.trainers.filter(trainer => trainer.trainerId === trainerId).length
    // ) {
    //   const updatedTrainers = user.trainers.filter(
    //     trainer => trainer.trainerId !== trainerId,
    //   );
    //   await database()
    //     .ref('users/' + currentUserId + '/')
    //     .update({
    //       trainers: updatedTrainers,
    //     });
    //   database()
    //     .ref('users/' + currentUserId)
    //     .once('value', snapshot => {
    //       setCurrentUser(snapshot.val());
    //     });
    //   return;
    // }

    // if (user.trainers) {
    //   await database()
    //     .ref('users/' + currentUserId + '/')
    //     .update({
    //       trainers: [...user.trainers, {trainerId, status: 'pending'}],
    //     });
    //   database()
    //     .ref('users/' + currentUserId)
    //     .once('value', snapshot => {
    //       setCurrentUser(snapshot.val());
    //     });
    //   return;
    // }

    // await database()
    //   .ref('users/' + currentUserId + '/')
    //   .update({
    //     trainers: [{trainerId, status: 'pending'}],
    //   });
    // database()
    //   .ref('users/' + currentUserId)
    //   .once('value', snapshot => {
    //     setCurrentUser(snapshot.val());
    //   });
  };

  console.log('customers', customers);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Clients</Text>
      {customers && (
        <View>
          {customers.filter(customer => {
            const status = customer.trainers.find(
              trainer => trainer.trainerId === currentUserId,
            ).status;
            if (status === 'accepted') {
              return customer;
            }
          }).length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cards}>
                {customers
                  .filter(customer => {
                    const status = customer.trainers.find(
                      trainer => trainer.trainerId === currentUserId,
                    ).status;
                    if (status === 'accepted') {
                      return customer;
                    }
                  })
                  .map(customer => (
                    <TouchableOpacity
                      onPress={() => {
                        setIsModalVisible(true);
                        setSelectedUser(customer);
                      }}>
                      <View style={{...styles.card}}>
                        <ImageBackground
                          style={styles.userImage}
                          source={
                            customer.userPhoto !== 'none'
                              ? {
                                  uri: customer.userPhoto,
                                }
                              : {
                                  uri: 'https://www.levistrauss.com/wp-content/uploads/2020/05/Black_Box.png',
                                }
                          }>
                          <View style={styles.textContainer}>
                            <Text style={styles.userText}>
                              {customer.fullName}
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
            <Text style={[styles.title, {color: '#67686A', marginBottom: 120}]}>
              You have no client yet.
            </Text>
          )}
        </View>
      )}
      <Text style={styles.title}>Clients Asking for Match</Text>
      {customers && (
        <View>
          {customers.filter(customer => {
            const status = customer.trainers.find(
              trainer => trainer.trainerId === currentUserId,
            ).status;
            if (status === 'pending') {
              return customer;
            }
          }).length > 0 ? (
            <ScrollView>
              <View style={styles.clientTabs}>
                {customers
                  .filter(customer => {
                    const status = customer.trainers.find(
                      trainer => trainer.trainerId === currentUserId,
                    ).status;
                    if (status === 'pending') {
                      return customer;
                    }
                  })
                  .map(customer => (
                    <View style={styles.clientTab}>
                      <Image
                        style={styles.clientImage}
                        source={
                          customer.userPhoto !== 'none'
                            ? {
                                uri: customer.userPhoto,
                              }
                            : {
                                uri: 'https://www.levistrauss.com/wp-content/uploads/2020/05/Black_Box.png',
                              }
                        }
                      />
                      <View style={styles.clientInfoBox}>
                        <Text style={styles.clientName}>
                          {customer.fullName}
                        </Text>
                        <Text style={styles.clientInfo}>
                          Weight: {customer.weight}
                        </Text>
                        <Text style={styles.clientInfo}>
                          Height: {customer.height}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.clientButton}
                        onPress={() =>
                          onStatusChange(customer.uid, 'rejected')
                        }>
                        <Image
                          style={{width: 17, height: 17}}
                          source={require('../assets/x.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.clientButton2}
                        onPress={() =>
                          onStatusChange(customer.uid, 'accepted')
                        }>
                        <Image
                          style={{width: 17, height: 15}}
                          source={require('../assets/check.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </ScrollView>
          ) : (
            <Text style={[styles.title, {color: '#67686A', marginBottom: 120}]}>
              You have no requests yet.
            </Text>
          )}
        </View>
      )}
      {isModalVisible && (
        <CustomerModal
          user={selectedUser}
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
    height: 50,
    backgroundColor: '#c2d8df',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
  clientTabs: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  clientTab: {
    width: '100%',
    height: 140,
    borderWidth: 1,
    borderColor: '#9abdc1',
    borderRadius: 15,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  clientImage: {
    height: '100%',
    width: '30%',
  },
  clientInfoBox: {
    paddingLeft: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  clientName: {
    fontFamily: 'CircularStd-Bold',
    color: '#9abdc1',
    fontSize: 18,
    marginBottom: 20,
  },
  clientInfo: {
    color: '#67686A',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
  clientButton: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  clientButton2: {
    position: 'absolute',
    right: 20,
    top: 70,
  },
});

export default ClienteleScreen;
