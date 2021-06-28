cd android
./gradlew bundleRelease -x bundleReleaseJsAndAssets
cd ..
npx react-native run-android --variant=release