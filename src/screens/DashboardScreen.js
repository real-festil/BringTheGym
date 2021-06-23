import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import GeolocationCommunity from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';

const DashboardScreen = () => {
  const [isGranted, setIsGranted] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    requestLocationPermission();
    GeolocationCommunity.getCurrentPosition(info => console.log(info));
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
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
        console.log('position', position);
        setLocation(position.coords);
      },
      error => {
        console.log('error', error);
      },
    );
  }, [isGranted]);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'ios') {
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
      Geolocation.requestAuthorization('whenInUse').then(res =>
        Geolocation.getCurrentPosition(
          pos => setLocation(pos.coords),
          err => console.log('error', error),
          {timeout: 10000, maximumAge: 10000},
        ),
      );
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        if (result === 'granted') {
          setIsGranted(true);
        }
      });
    }
  };

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
      ],
    },
    {
      elementType: 'labels',
      stylers: [
        {
          color: '#908418',
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels.text',
      stylers: [
        {
          color: '#908418',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#676565',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f5f5',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dadada',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#c9c9c9',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#acb9b9',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
  ];

  console.log(location);

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
          customMapStyle={mapStyle}>
          <Marker
            // image={require('../assets/pin.png')}
            coordinate={{
              latitude: location ? location.latitude : 137.78825,
              longitude: location ? location.longitude : -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Image
              source={require('../assets/pin.png')}
              style={{width: 33, height: 44}}
            />
          </Marker>
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    elevation: 4,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});

export default DashboardScreen;
