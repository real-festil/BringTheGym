import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const FindTrainer = ({onSearch, onClose, selectedFilters}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState([]);
  const [selectedQual, setSelectedQual] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState([]);
  const [trainers, setTrainers] = useState(null);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    openAnimation();
    if (selectedFilters) {
      if (selectedFilters.qual) {
        setSelectedQual(selectedFilters.qual);
      }
      if (selectedFilters.goal) {
        setSelectedGoal(selectedFilters.goal);
      }
      if (selectedFilters.spec) {
        setSelectedSpec(selectedFilters.spec);
      }
    }
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
    }, 100);
  };

  const onSearchHandler = () => {
    fadeOut();
    setTimeout(() => {
      onSearch({qual: selectedQual, spec: selectedSpec, goal: selectedGoal});
    }, 100);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 150,
  };

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

  const goals = [
    'Muscle Gain',
    'Endurance',
    'Weight Loss',
    'Dieting',
    'Calisthenic',
  ];

  const loading = [
    'Loading...',
    'Loading...',
    'Loading...',
    'Loading...',
    'Loading...',
    'Loading...',
  ];

  return (
    <GestureRecognizer config={config} onSwipeDown={state => onCloseHandler()}>
      <Modal style={styles.container} transparent>
        <TouchableOpacity style={styles.backdrop} onPress={onCloseHandler} />

        <Animated.View
          useNativeD
          style={[styles.modal, {transform: [{translateY}]}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // borderBottomColor: 'red',
                // borderBottomWidth: 1,
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={onCloseHandler}>
                <Text style={styles.subTitle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSearchHandler}>
                <Text style={styles.subTitle}>Apply</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Goals</Text>
            <View style={styles.specContainer}>
              {goals.map(goal => (
                <TouchableOpacity
                  style={[
                    styles.specButton,
                    {
                      backgroundColor: selectedGoal.includes(goal)
                        ? '#9ABDC2'
                        : '#22191A',
                    },
                  ]}
                  onPress={() => {
                    selectedGoal.includes(goal)
                      ? setSelectedGoal(
                          selectedGoal.filter(item => item !== goal),
                        )
                      : setSelectedGoal([...selectedGoal, goal]);
                  }}>
                  <Text
                    style={[
                      styles.spec,
                      {
                        color: selectedGoal.includes(goal)
                          ? 'black'
                          : '#9ABDC2',
                      },
                    ]}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.title}>Specialities</Text>
            {trainers ? (
              <View style={styles.specContainer}>
                {trainers
                  .map(trainer => trainer.specialities)
                  .filter(spec => spec)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(spec => (
                    <TouchableOpacity
                      style={[
                        styles.specButton,
                        {
                          backgroundColor: selectedSpec.includes(spec)
                            ? '#9ABDC2'
                            : '#22191A',
                        },
                      ]}
                      onPress={() => {
                        selectedSpec.includes(spec)
                          ? setSelectedSpec(
                              selectedSpec.filter(item => item !== spec),
                            )
                          : setSelectedSpec([...selectedSpec, spec]);
                      }}>
                      <Text
                        style={[
                          styles.spec,
                          {
                            color: selectedSpec.includes(spec)
                              ? 'black'
                              : '#9ABDC2',
                          },
                        ]}>
                        {spec}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ) : (
              <View style={styles.specContainer}>
                {loading.map(item => (
                  <TouchableOpacity style={[styles.specButton]}>
                    <Text style={[styles.spec]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={styles.title}>Qualifications</Text>
            {trainers ? (
              <View style={styles.specContainer}>
                {trainers
                  .map(trainer => trainer.qualification)
                  .filter(qual => qual)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(qual => (
                    <TouchableOpacity
                      style={[
                        styles.specButton,
                        {
                          backgroundColor: selectedQual.includes(qual)
                            ? '#9ABDC2'
                            : '#22191A',
                        },
                      ]}
                      onPress={() => {
                        selectedQual.includes(qual)
                          ? setSelectedQual(
                              selectedQual.filter(item => item !== qual),
                            )
                          : setSelectedQual([...selectedQual, qual]);
                      }}>
                      <Text
                        style={[
                          styles.qual,
                          {
                            color: selectedQual.includes(qual)
                              ? 'black'
                              : '#9ABDC2',
                          },
                        ]}>
                        {qual}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ) : (
              <View style={styles.specContainer}>
                {loading.map(item => (
                  <TouchableOpacity style={[styles.specButton]}>
                    <Text style={[styles.spec]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() =>
                onSearch({qual: selectedQual, spec: selectedSpec})
              }>
              <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
          </View> */}
          </ScrollView>
        </Animated.View>
      </Modal>
    </GestureRecognizer>
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
    paddingHorizontal: 20,
  },
  title: {
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  specContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  subTitle: {
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
    fontSize: 14,
  },
  specButton: {
    borderWidth: 1,
    borderColor: '#9ABDC2',
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 3,
    marginRight: 10,
  },
  spec: {
    fontFamily: 'CircularStd-Book',
    color: '#9ABDC2',
  },
  searchButton: {
    backgroundColor: '#9ABDC2',
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchText: {
    color: 'black',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
});

export default FindTrainer;
