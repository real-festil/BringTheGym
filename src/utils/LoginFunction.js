import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import firebase from '../../database/fireBase';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

const LoginFunctions = {
  signInOrLink: async function (provider, credential, email) {
    this.saveCredential(provider, credential);
    console.log(credential, 'cred');
    await auth()
      .signInWithCredential(credential)
      .catch(async error => {
        console.log('auth/account-exists-with-different-credential"');
        try {
          if (error.code != 'auth/account-exists-with-different-credential') {
            throw error;
          }

          let methods = await auth().fetchSignInMethodsForEmail(email);
          console.log('tut', methods);
          let oldCred = await this.getCredential(methods[0]);
          let prevUser = await auth().signInWithCredential(oldCred);
          auth().currentUser.linkWithCredential(credential);
        } catch (error) {
          console.log('tit', error);
          Alert.alert(
            'Something went wrong!',
            'The password is invalid or the user does not have a password',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Reset password',
                onPress: () => {
                  firebase
                    .auth()
                    .sendPasswordResetEmail(email)
                    .then(function (user) {
                      alert('Please check your email...');
                    })
                    .catch(function (e) {
                      console.log(e);
                    });
                },
              },
            ],
          );

          throw error;
        }
      });
  },

  registerOrLink: async function (
    provider,
    credential,
    email,
    fullName,
    address,
    date,
    weight,
    height,
    train,
    bio,
    goals,
    userPhoto,
  ) {
    this.saveCredential(provider, credential);
    let user = await auth()
      .createUserWithEmailAndPassword(credential.token, credential.secret)
      .then(res => {
        res.user.updateProfile({
          displayName: fullName,
        });
        console.log('registered', res.user.uid);
        if (res.user.uid) {
          const userId = res.user.uid;
          firebase
            .database()
            .ref('users/' + userId + '/')
            .set({
              email: email,
              fullName: fullName,
              birthday: moment(date).format(),
              weight: weight,
              height: height,
              train: train,
              goals: goals,
              bio: bio,
              role: 'customer',
            })
            .then(() => {
              console.log(userPhoto, 'userPhoto');
              if (userPhoto) {
                const reference = storage().ref(`${userId}/profile-image.png`);
                console.log('uploaded', userPhoto);
                const task = reference.putFile(
                  Platform.OS == 'android'
                    ? userPhoto.uri
                    : userPhoto.sourceURL,
                );

                task.on('state_changed', taskSnapshot => {
                  console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                  );
                });

                task.then(() => {
                  console.log('Image uploaded to the bucket!');
                  this.getPhotoUrl(userId)
                    .then(url => {
                      firebase
                        .database()
                        .ref('users/' + userId + '/')
                        .update({
                          userPhoto: url,
                        });
                    })

                    .catch(error => {
                      console.log('Storing Error', error);
                    });
                });
              } else {
                console.log('no photo');
                firebase
                  .database()
                  .ref('users/' + userId + '/')
                  .update({
                    userPhoto: 'none',
                  })
                  .catch(error => {});
              }
            });
        }
      })
      .catch(async error => {
        console.log('google');
        try {
          if (error.code != 'auth/email-already-in-use') {
            throw error;
          }
          let methods = await auth().fetchSignInMethodsForEmail(email);
          let oldCred = await this.getCredential(methods[0]);
          let prevUser = await auth().signInWithCredential(oldCred);
          auth().currentUser.linkWithCredential(credential);
        } catch (error) {
          throw error;
        }
      });
  },
  getPhotoUrl: async function (userId) {
    const url = await storage()
      .ref(userId + '/profile-image.png')
      .getDownloadURL();

    return url;
  },

  registerOrLinkTrainer: async function (
    provider,
    credential,
    email,
    fullName,
    address,
    date,
    bio,
    qualification,
    specialities,
    userPhoto,
    telegram,
    whatsApp,
    facebook,
  ) {
    this.saveCredential(provider, credential);
    let user = await auth()
      .createUserWithEmailAndPassword(credential.token, credential.secret)
      .then(res => {
        res.user.updateProfile({
          displayName: fullName,
        });
        console.log('registered as trainer', res.user.uid);

        if (res.user.uid) {
          const userId = res.user.uid;
          let photoUrl = '';
          firebase
            .database()
            .ref('users/' + userId + '/')
            .set({
              email: email,
              fullName: fullName,
              birthday: moment(date).format(),
              bio: bio,
              qualification: qualification,
              specialities: specialities,
              telegram,
              whatsApp,
              facebook,
              photoUrl: photoUrl,
              role: 'trainer',
            })
            .then(() => {
              if (userPhoto) {
                const reference = storage().ref(userId + '/profile-image.png');
                console.log('uploaded');
                const task = reference.putFile(
                  Platform.OS == 'android'
                    ? userPhoto.uri
                    : userPhoto.sourceURL,
                );

                task.on('state_changed', taskSnapshot => {
                  console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                  );
                });

                task.then(() => {
                  console.log('Image uploaded to the bucket!');
                  this.getPhotoUrl(userId)
                    .then(url => {
                      firebase
                        .database()
                        .ref('users/' + userId + '/')
                        .update({
                          userPhoto: url,
                        });
                    })

                    .catch(error => {
                      console.log('Storing Error', error);
                    });
                });
              } else {
                firebase
                  .database()
                  .ref('users/' + userId + '/')
                  .update({
                    userPhoto: 'none',
                  });
              }
            });
        }
      })
      .catch(async error => {
        console.log(error, 'loginerror');
        try {
          if (error.code != 'auth/email-already-in-use') {
            throw error;
          }
          let methods = await auth().fetchSignInMethodsForEmail(email);
          let oldCred = await this.getCredential(methods[0]);
          let prevUser = await auth().signInWithCredential(oldCred);
          auth().currentUser.linkWithCredential(credential);
        } catch (error) {
          throw error;
        }
      });
  },

  getCredential: async function (provider) {
    try {
      let value = await AsyncStorage.getItem(provider);
      if (value !== null) {
        let [token, secret] = JSON.parse(value);
        return this.getProvider(provider).credential(token, secret);
      }
    } catch (error) {
      throw error;
    }
  },

  saveCredential: async function (provider, credential) {
    try {
      let saveData = JSON.stringify([credential.token, credential.secret]);
      await AsyncStorage.setItem(provider, saveData);
    } catch (error) {
      throw error;
    }
  },

  getProvider: function (providerId) {
    switch (providerId) {
      case auth.GoogleAuthProvider.PROVIDER_ID:
        return auth.GoogleAuthProvider;
      case auth.FacebookAuthProvider.PROVIDER_ID:
        return auth.FacebookAuthProvider;
      case auth.EmailAuthProvider.PROVIDER_ID:
        return auth.EmailAuthProvider;
      default:
        throw new Error(`No provider implemented for ${providerId}`);
    }
  },
};
export default LoginFunctions;
