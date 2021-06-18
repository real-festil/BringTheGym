import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import EquipmentModal from '../components/EquipmentModal';
import auth from '@react-native-firebase/auth';

const EquipmentScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [prevEquipment, setPrevEquipment] = useState(null);
  const [nextEquipment, setNextEquipment] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('equipments');
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    database()
      .ref('equipments')
      .once('value')
      .then(snapshot => {
        setEquipment(Object.values(snapshot.val()));
      });
    database()
      .ref('users/' + currentUserId)
      .on('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  }, []);

  const onBuy = id => {
    setIsModalVisible(false);
    setIsAcceptModalVisible(false);
    if (currentUser) {
      if (currentUser.equipments) {
        if (currentUser.equipments.includes(id)) {
          return;
        } else {
          database()
            .ref('users/' + currentUserId + '/')
            .update({
              equipments: [...currentUser.equipments, id],
            });
          database()
            .ref('users/' + currentUserId)
            .once('value', snapshot => {
              setCurrentUser(snapshot.val());
            });
          return;
        }
      } else {
        database()
          .ref('users/' + currentUserId + '/')
          .update({
            equipments: [id],
          });
        database()
          .ref('users/' + currentUserId)
          .once('value', snapshot => {
            setCurrentUser(snapshot.val());
          });
        return;
      }
    }
  };

  let filteredEquipment;

  if (equipment) {
    filteredEquipment = equipment.filter(equip => {
      if (selectedTab === 'equipments') {
        if (currentUser && currentUser.equipments) {
          return !currentUser.equipments.includes(equip.id);
        }
        return equip;
      }
      if (selectedTab === 'myequipments') {
        if (currentUser && currentUser.equipments) {
          return currentUser.equipments.includes(equip.id);
        }
      }
    });
  }

  const onChangeEquipment = item => {
    setSelectedEquipment(item);
    const index = filteredEquipment.findIndex(equip => equip === item);
    setPrevEquipment(filteredEquipment[index - 1]);
    setNextEquipment(filteredEquipment[index + 1]);
  };

  console.log('equipment', equipment);
  console.log('filteredEquipment', filteredEquipment);
  console.log('currentUser', currentUser);
  console.log('currentTab', selectedTab);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Equipment</Text>
      {equipment && (
        <View>
          {!equipment.filter(equip => {
            if (currentUser && currentUser.equipments) {
              return currentUser.equipments.includes(equip.id);
            }
          }).length ? (
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
                You have no equipment yet.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal>
              <View style={styles.cards}>
                {equipment
                  .filter(equip => {
                    if (currentUser && currentUser.equipments) {
                      return currentUser.equipments.includes(equip.id);
                    }
                  })
                  .map((equip, index) => (
                    <View>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                          setIsModalVisible(true);
                          setSelectedEquipment(equip);
                          setPrevEquipment(filteredEquipment[index - 1]);
                          setNextEquipment(filteredEquipment[index + 1]);
                        }}
                        key={equip.id}>
                        <ImageBackground
                          style={styles.userImage}
                          source={
                            equip.image !== 'none'
                              ? {
                                  uri: equip.image,
                                }
                              : {
                                  uri: 'https://www.levistrauss.com/wp-content/uploads/2020/05/Black_Box.png',
                                }
                          }
                        />
                      </TouchableOpacity>
                      <View style={styles.textContainer}>
                        <Text style={styles.userText}>{equip.name}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
      <Text style={styles.title}>Order Equipment</Text>
      {filteredEquipment && (
        <View>
          {!filteredEquipment.length ? (
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
                No equipments left.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal>
              <View style={styles.cards}>
                {filteredEquipment.map((equip, index) => (
                  <View>
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() => {
                        setIsModalVisible(true);
                        setSelectedEquipment(equip);
                        setPrevEquipment(filteredEquipment[index - 1]);
                        setNextEquipment(filteredEquipment[index + 1]);
                      }}
                      key={equip.id}>
                      <ImageBackground
                        style={styles.userImage}
                        source={
                          equip.image !== 'none'
                            ? {
                                uri: equip.image,
                              }
                            : {
                                uri: 'https://www.levistrauss.com/wp-content/uploads/2020/05/Black_Box.png',
                              }
                        }
                      />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                      <Text style={styles.userText}>{equip.name}</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        width: 130,
                      }}>
                      <TouchableOpacity
                        style={styles.orderButton}
                        onPress={() => {
                          setSelectedId(equip.id);
                          setIsAcceptModalVisible(true);
                        }}>
                        <Text style={styles.orderText}>Order</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
      {isModalVisible && (
        <EquipmentModal
          equipment={selectedEquipment}
          nextEquipment={nextEquipment}
          prevEquipment={prevEquipment}
          onNext={item => onChangeEquipment(item)}
          onPrev={item => onChangeEquipment(item)}
          onClose={() => setIsModalVisible(false)}
          onBuy={onBuy}
          isAdded={
            currentUser.equipments &&
            currentUser.equipments.includes(selectedEquipment.id)
          }
        />
      )}
      <Modal visible={isAcceptModalVisible} transparent>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.acceptModal}>
            <Text style={styles.acceptModalText}>
              Are you sure you want to buy this equipment?
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => onBuy(selectedId)}>
                <Text style={styles.orderText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => setIsAcceptModalVisible(false)}>
                <Text style={styles.orderText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    zIndex: 10,
  },
  title: {
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
    color: '#9abdc1',
  },
  acceptModal: {
    width: 250,
    height: 100,
    padding: 10,
    margin: 0,
    backgroundColor: '#22191A',
    borderRadius: 15,
  },
  acceptModalText: {
    fontSize: 16,
    fontFamily: 'CircularStd-Bold',
    textAlign: 'center',
    color: '#9abdc1',
    marginBottom: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  tab: {
    backgroundColor: '#c2d8df',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
  },
  tabText: {
    fontFamily: 'CircularStd-Book',
    fontSize: 18,
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 20,
    width: 130,
    height: 130,
    backgroundColor: 'red',
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    marginRight: 20,
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
    height: 40,
    bottom: 0,
    marginTop: -20,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
  },
  userImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c2d8df',
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

export default EquipmentScreen;
