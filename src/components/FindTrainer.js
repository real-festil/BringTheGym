import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const FindTrainer = ({onSearch}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState([]);
  const [selectedQual, setSelectedQual] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState([]);
  const [trainers, setTrainers] = useState(null);
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

  console.log('selectedQual', selectedQual);
  console.log('selectedSpec', selectedSpec);

  const goals = [
    'Muscle Gain',
    'Endurance',
    'Weight Loss',
    'Dieting',
    'Calisthenic',
  ];

  return (
    <View style={styles.container}>
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
                ? setSelectedGoal(selectedGoal.filter(item => item !== goal))
                : setSelectedGoal([...selectedGoal, goal]);
            }}>
            <Text
              style={[
                styles.spec,
                {color: selectedGoal.includes(goal) ? 'black' : '#9ABDC2'},
              ]}>
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.title}>Specialities</Text>
      {trainers && (
        <View style={styles.specContainer}>
          {trainers
            .map(trainer => trainer.specialities)
            .filter(spec => spec)
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
                    {color: selectedSpec.includes(spec) ? 'black' : '#9ABDC2'},
                  ]}>
                  {spec}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
      <Text style={styles.title}>Qualifications</Text>
      {trainers && (
        <View style={styles.specContainer}>
          {trainers
            .map(trainer => trainer.qualification)
            .filter(qual => qual)
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
                    {color: selectedQual.includes(qual) ? 'black' : '#9ABDC2'},
                  ]}>
                  {qual}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => onSearch({qual: selectedQual, spec: selectedSpec})}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  title: {
    color: '#9ABDC2',
    fontFamily: 'CircularStd-Bold',
    fontSize: 16,
  },
  specContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
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
