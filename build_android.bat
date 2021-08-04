cd android
./gradlew bundleRelease -x bundleReleaseJsAndAssets
cd ..
call npx react-native run-android --variant=release