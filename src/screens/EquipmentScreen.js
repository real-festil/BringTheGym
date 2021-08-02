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
  Linking,
  Platform,
} from 'react-native';
import EquipmentModal from '../components/EquipmentModal';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';

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
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const currentUserId = auth().currentUser.uid;

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

  const onBuy = (id, monthsCount) => {
    setIsModalVisible(false);
    setIsAcceptModalVisible(false);
    if (currentUser) {
      if (currentUser.equipments && currentUser.equipments.length > 0) {
        if (
          currentUser.equipments.filter(
            currEquip => currEquip.id === id && currEquip.status !== 'rejected',
          ).length > 0
        ) {
          return;
        } else {
          if (monthsCount) {
            database()
              .ref('users/' + currentUserId + '/')
              .update({
                equipments: [
                  ...currentUser.equipments.filter(
                    currEquip => currEquip.id !== id,
                  ),
                  {
                    id,
                    status: 'pending',
                    createdAt: moment().format(),
                    expiredAt: moment().add(monthsCount, 'M').format(),
                  },
                ],
              });
          } else {
            database()
              .ref('users/' + currentUserId + '/')
              .update({
                equipments: [
                  ...currentUser.equipments.filter(
                    currEquip => currEquip.id !== id,
                  ),
                  {
                    id,
                    status: 'pending',
                    // createdAt: moment(),
                  },
                ],
              });
          }
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
            equipments: [
              {id, status: 'pending', createdAt: JSON.stringify(new Date())},
            ],
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
        if (
          currentUser &&
          currentUser.equipments &&
          currentUser.equipments.length > 0
        ) {
          return (
            !currentUser.equipments.filter(
              currEquip => currEquip.id === equip.id,
            ).length > 0
          );
        }
        return equip;
      }
      if (selectedTab === 'myequipments') {
        if (
          currentUser &&
          currentUser.equipments &&
          currentUser.equipments.length > 0
        ) {
          return (
            currentUser.equipments.filter(
              currEquip => currEquip.id === equip.id,
            ).length > 0
          );
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
  console.log('selectedId', selectedId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Current Equipment</Text>
      {equipment && (
        <View>
          {!equipment.filter(equip => {
            if (
              currentUser &&
              currentUser.equipments &&
              currentUser.equipments.length > 0
            ) {
              return (
                currentUser.equipments
                  .filter(equip => equip.status === 'successful')
                  .filter(currEquip => currEquip.id === equip.id).length > 0
              );
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cards}>
                {equipment
                  .filter(equip => {
                    if (
                      currentUser &&
                      currentUser.equipments &&
                      currentUser.equipments.length > 0
                    ) {
                      return (
                        currentUser.equipments
                          .filter(equip => equip.status === 'successful')
                          .filter(currEquip => currEquip.id === equip.id)
                          .length > 0
                      );
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
                          resizeMode="contain"
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cards}>
                {filteredEquipment
                  .filter(equip => !equip.deleted)
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
                          resizeMode="contain"
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
      <Text style={[styles.title, {marginTop: 20}]}>Ordered Equipment</Text>
      {equipment && (
        <View>
          {!equipment.filter(equip => {
            if (
              currentUser &&
              currentUser.equipments &&
              currentUser.equipments.length > 0
            ) {
              return (
                currentUser.equipments
                  .filter(equip => equip.status === 'pending')
                  .filter(currEquip => currEquip.id === equip.id).length > 0
              );
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
                You have no ordered equipment yet.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{marginBottom: 20}}
              horizontal
              showsHorizontalScrollIndicator={false}>
              <View style={styles.cards}>
                {equipment
                  .filter(equip => {
                    if (
                      currentUser &&
                      currentUser.equipments &&
                      currentUser.equipments.length > 0
                    ) {
                      return (
                        currentUser.equipments
                          .filter(equip => equip.status === 'pending')
                          .filter(currEquip => currEquip.id === equip.id)
                          .length > 0
                      );
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
                          resizeMode="contain"
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
      <Text style={[styles.title, {marginTop: 0}]}>Expired Equipment</Text>
      {equipment && (
        <View>
          {!equipment.filter(equip => {
            if (
              currentUser &&
              currentUser.equipments &&
              currentUser.equipments.length > 0
            ) {
              return (
                currentUser.equipments
                  .filter(equip => equip.status === 'rejected')
                  .filter(currEquip => currEquip.id === equip.id).length > 0
              );
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
                You have no expired equipment.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{marginBottom: 20}}
              horizontal
              showsHorizontalScrollIndicator={false}>
              <View style={styles.cards}>
                {equipment
                  .filter(equip => {
                    if (
                      currentUser &&
                      currentUser.equipments &&
                      currentUser.equipments.length > 0
                    ) {
                      return (
                        currentUser.equipments
                          .filter(equip => equip.status === 'rejected')
                          .filter(currEquip => currEquip.id === equip.id)
                          .length > 0
                      );
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
                          resizeMode="contain"
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
                          <Text style={styles.orderText}>Extend</Text>
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
          onBuy={id => {
            setSelectedId(id);
            setIsAcceptModalVisible(true);
          }}
          isAdded={
            currentUser.equipments &&
            currentUser.equipments.length > 0 &&
            currentUser.equipments.filter(
              currEquip =>
                currEquip.id === selectedEquipment.id &&
                currEquip.status !== 'rejected',
            ).length > 0
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
            {/* <Text style={styles.acceptModalText}>
              Are you sure you want to buy this equipment?
            </Text> */}
            {equipment && (
              <>
                {equipment.length > 0 &&
                selectedId &&
                equipment.find(equip => equip.id === selectedId).weights ? (
                  <>
                    {console.log('selectedW', selectedWeight, selectedMonth)}
                    <Text style={styles.pickerText}>Select weight</Text>
                    <Picker
                      onValueChange={v => setSelectedWeight(v)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      mode="dropdown"
                      selectedValue={
                        selectedWeight ? selectedWeight : 'No weight selected'
                      }>
                      <Picker.Item label="No weight selected" value="" />
                      {Object.keys(
                        equipment.find(equip => equip.id === selectedId)
                          .weights,
                      )
                        .map(key => [
                          key,
                          equipment.find(equip => equip.id === selectedId)
                            .weights[key],
                        ])
                        .map(weight => (
                          <Picker.Item
                            label={weight[0] + ' | $' + weight[1]}
                            value={weight[0]}
                          />
                        ))}
                    </Picker>
                    <Text style={styles.pickerText}>Select months</Text>
                    <Picker
                      onValueChange={v => setSelectedMonth(v)}
                      style={styles.picker}
                      mode="dropdown"
                      itemStyle={styles.pickerItem}
                      selectedValue={selectedMonth}>
                      {months.map((m, i) => (
                        <Picker.Item
                          label={m.toString()}
                          value={m.toString()}
                        />
                      ))}
                    </Picker>
                    {selectedMonth && selectedWeight && (
                      <Text style={[styles.pickerText]}>
                        Total price: $
                        {(
                          equipment.find(equip => equip.id === selectedId)
                            .weights[selectedWeight] * selectedMonth
                        ).toFixed(2)}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                      }}>
                      {selectedMonth && selectedWeight ? (
                        <TouchableOpacity
                          style={[styles.orderButton]}
                          onPress={() => {
                            onBuy(selectedId, selectedMonth);
                            setSelectedWeight(null);
                            setSelectedMonth(1);
                          }}>
                          <Text style={styles.orderText}>Buy</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={[styles.orderButton]}>
                          <Text style={styles.orderText}>Buy</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.orderButton}
                        onPress={() => {
                          setSelectedWeight(null);
                          setSelectedMonth(1);
                          setIsAcceptModalVisible(false);
                        }}>
                        <Text style={styles.orderText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width: '100%', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL('mailto:Bringthegym@gmail.com')
                        }
                        style={[
                          styles.orderButton,
                          {width: 170, marginTop: 20, justifyContent: 'center'},
                        ]}>
                        <Text style={styles.orderText}>
                          Ask for consultation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.pickerText}>Select months</Text>
                    <Picker
                      onValueChange={v => setSelectedMonth(v)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      selectedValue={selectedMonth}>
                      {months.map((m, i) => (
                        <Picker.Item
                          label={m.toString()}
                          value={m.toString()}
                        />
                      ))}
                    </Picker>
                    {selectedMonth &&
                      equipment.find(equip => equip.id === selectedId) && (
                        <Text style={[styles.pickerText]}>
                          Total price: $
                          {(
                            equipment.find(equip => equip.id === selectedId)
                              .price * selectedMonth
                          ).toFixed(2)}
                        </Text>
                      )}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                      }}>
                      {selectedMonth ? (
                        <TouchableOpacity
                          style={[styles.orderButton]}
                          onPress={() => {
                            onBuy(selectedId, selectedMonth);
                            setSelectedWeight(null);
                            setSelectedMonth(1);
                          }}>
                          <Text style={styles.orderText}>Buy</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={[styles.orderButton]}>
                          <Text style={styles.orderText}>Buy</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.orderButton}
                        onPress={() => {
                          setSelectedWeight(null);
                          setSelectedMonth(1);
                          setIsAcceptModalVisible(false);
                        }}>
                        <Text style={styles.orderText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#22191A',
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    zIndex: 10,
    paddingBottom: 30,
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
    // height: 400,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
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
    backgroundColor: 'black',
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
  pickerText: {
    color: '#9ABDC2',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    color: '#9ABDC2',
    textAlign: 'center',
    fontSize: 16,
  },
  pickerItem: {
    color: '#9ABDC2',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default EquipmentScreen;
