module.exports = {
  root: true,
  rules: {
    'linebreak-style': [
      'error',
      process.env.NODE_ENV === 'prod' ? 'unix' : 'windows',
    ],
  },
  extends: '@react-native-community',
};
