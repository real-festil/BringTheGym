import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import EquipmentModal from '../components/EquipmentModal';
import auth from '@react-native-firebase/auth';

const EquipmentScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('equipments');
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
      .once('value', snapshot => {
        setCurrentUser(snapshot.val());
      });
  }, []);

  const onBuy = id => {
    setIsModalVisible(false);
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
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab('equipments')}
          style={[
            styles.tab,
            selectedTab === 'equipments'
              ? {borderColor: 'black', borderWidth: 1}
              : {},
          ]}>
          <Text style={styles.tabText}>Equipments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('myequipments')}
          style={[
            styles.tab,
            selectedTab === 'myequipments'
              ? {borderColor: 'black', borderWidth: 1}
              : {},
          ]}>
          <Text style={styles.tabText}>My equipments</Text>
        </TouchableOpacity>
      </View>
      {equipment && (
        <ScrollView>
          <View style={styles.cards}>
            {equipment
              .filter(equip => {
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
              })
              .map(equip => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    setIsModalVisible(true);
                    setSelectedEquipment(equip);
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
                    }>
                    <View style={styles.textContainer}>
                      <Text style={styles.userText}>{equip.name}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      )}
      {isModalVisible && (
        <EquipmentModal
          equipment={selectedEquipment}
          onClose={() => setIsModalVisible(false)}
          onBuy={onBuy}
          isAdded={
            currentUser.equipments &&
            currentUser.equipments.includes(selectedEquipment.id)
          }
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
    zIndex: 10,
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
    fontFamily: 'CircularStd-Bold',
    marginVertical: 10,
  },
  userImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c2d8df',
  },
});

export default EquipmentScreen;
