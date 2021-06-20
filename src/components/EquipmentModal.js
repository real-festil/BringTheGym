import React, {useRef, useEffect} from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';

const EquipmentModal = ({
  equipment,
  onClose,
  onBuy,
  isAdded,
  nextEquipment,
  prevEquipment,
  onNext,
  onPrev,
}) => {
  const {
    id,
    weight,
    price,
    name,
    image,
    duration,
    durationType,
    number,
    description,
  } = equipment;

  useEffect(() => {
    // openAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

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
    // fadeOut();
    onClose();
    // setTimeout(() => {
    // }, 200);
  };

  const onNextHandler = () => {
    Animated.timing(translateX, {
      toValue: -350,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onNext(nextEquipment);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });
  };

  const onPrevHandler = () => {
    Animated.timing(translateX, {
      toValue: 350,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onPrev(prevEquipment);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <Modal style={styles.container} animationType="slide">
      <TouchableOpacity style={styles.backdrop} onPress={onCloseHandler} />
      <Animated.View useNativeD style={[styles.modal, {height: '100%'}]}>
        <TouchableOpacity style={styles.backButton} onPress={onCloseHandler}>
          <Image
            source={require('../assets/back-arr.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.statsList}>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Weight</Text>
              <Text style={styles.statsSubTitle}>kilogram</Text>
              <View style={styles.statsValue}>
                <Text style={styles.statsValueText}>{weight}</Text>
              </View>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Number</Text>
              <Text style={styles.statsSubTitle} />
              <View style={styles.statsValue}>
                <Text style={styles.statsValueText}>{number}</Text>
              </View>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Duration</Text>
              <Text style={styles.statsSubTitle}>{durationType}</Text>
              <View style={styles.statsValue}>
                <Text style={styles.statsValueText}>{duration}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.imageContainer}>
            {/* {prevEquipment && (
              <TouchableOpacity
                style={styles.prevBlock}
                onPress={onPrevHandler}>
                <Image
                  style={styles.prevImage}
                  source={require('../assets/arrow.png')}
                />
              </TouchableOpacity>
            )} */}
            <Animated.View style={[styles.images, {transform: [{translateX}]}]}>
              {prevEquipment && (
                <Image
                  style={styles.prevUserImage}
                  source={
                    prevEquipment.image !== 'none'
                      ? {
                          uri: prevEquipment.image,
                        }
                      : require('../assets/profile_photo.png')
                  }
                />
              )}
              <Image
                style={styles.userImage}
                source={
                  image !== 'none'
                    ? {
                        uri: image,
                      }
                    : require('../assets/profile_photo.png')
                }
              />
              {nextEquipment && (
                <Image
                  style={styles.nextUserImage}
                  source={
                    nextEquipment.image !== 'none'
                      ? {
                          uri: nextEquipment.image,
                        }
                      : require('../assets/profile_photo.png')
                  }
                />
              )}
            </Animated.View>
            {/* {nextEquipment && (
              <TouchableOpacity
                style={styles.nextBlock}
                onPress={onNextHandler}>
                <Image
                  style={styles.nextImage}
                  source={require('../assets/arrow.png')}
                />
              </TouchableOpacity>
            )} */}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.subtitle}>Details</Text>
            <Text style={styles.info}>{description}</Text>
          </View>
        </ScrollView>
        {!isAdded && (
          <View style={styles.buyContainer}>
            <Text style={styles.priceText}>${price}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                fadeOut();
                setTimeout(() => {
                  onBuy(id);
                }, 200);
              }}>
              <Text style={styles.buyText}>Add to Chart</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#9abdc1',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 65:40,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1000,
    width: 40,
    height: 40,
    top: Platform.OS === 'ios' ? 35 : 5,
    left: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'CircularStd-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'CircularStd-Bold',
  },
  fullName: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    fontSize: 18,
  },
  infoBlock: {
    paddingHorizontal: 30,
    paddingVertical: 7,
  },
  images: {
    position: 'relative',
  },
  userImage: {
    width: 250,
    height: 250,
    display: 'flex',
    marginTop: 10,
    backgroundColor: '#9abdc1',
  },
  nextUserImage: {
    width: 250,
    height: 250,
    display: 'flex',
    marginTop: 10,
    backgroundColor: '#9abdc1',
    position: 'absolute',
    right: -350,
  },
  prevUserImage: {
    width: 250,
    height: 250,
    display: 'flex',
    marginTop: 10,
    backgroundColor: '#9abdc1',
    position: 'absolute',
    left: -350,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
    backgroundColor: '#9abdc1',
    position: 'relative',
  },
  prevBlock: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 40,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    left: -10,
    transform: [{rotate: '180deg'}],
  },
  prevImage: {
    width: 20,
    height: 20,
  },
  nextBlock: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 40,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    right: -10,
  },
  nextImage: {
    width: 20,
    height: 20,
  },
  info: {
    fontFamily: 'CircularStd-Book',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    width: '90%',
    backgroundColor: 'black',
    height: 60,
    marginVertical: 10,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    fontFamily: 'CircularStd-Bold',
  },
  statsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statsCard: {
    width: '27%',
    backgroundColor: '#c2d8df',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingTop: 20,
    paddingBottom: 5,
  },
  statsTitle: {
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
  },
  statsSubTitle: {
    textAlign: 'center',
    color: '#4E4E4E',
    fontSize: 12,
    fontFamily: 'CircularStd-Book',
  },
  statsValue: {
    backgroundColor: 'black',
    width: '70%',
    borderRadius: 35,
    paddingVertical: 7,
    marginTop: 10,
  },
  statsValueText: {
    textAlign: 'center',
    color: '#c2d8df',
    fontSize: 20,
    fontFamily: 'CircularStd-Book',
  },
  buyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#c2d8df',
    paddingVertical: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 20,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  priceText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'CircularStd-Bold',
  },
  buyButton: {
    borderRadius: 35,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buyText: {
    color: '#c2d8df',
    fontFamily: 'CircularStd-Book',
  },
});

export default EquipmentModal;
