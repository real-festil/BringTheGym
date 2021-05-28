import React from 'react';
import {View, Text, Image, StyleSheet, PermissionsAndroid, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';


const DashboardScreen = () => {
  const [isGranted, setIsGranted] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    requestLocationPermission();
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position)
        setLocation(position.coords);
      },
      error => {
        console.log('error', error);
      },
    );
  }, []);

  React.useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position)
        setLocation(position.coords);
      },
      error => {
        console.log('error', error);
      },
    );
  }, [isGranted]);

  const requestLocationPermission = async () => {
    if(Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Bring The Gym Map Permission',
          message: 'Bring The Gym need access to your geolocation ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsGranted(true);
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        if(result === 'granted') {
          setIsGranted(true)
        }
      });
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: location ? location.latitude : 137.78825,
            longitude: location ? location.longitude : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#9abdc1',
    position: 'relative',
  },
  mapContainer: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    height: '85%',
    width: '80%',
    position: 'absolute',
    right: -6,
    top: 40,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});

export default DashboardScreen;
