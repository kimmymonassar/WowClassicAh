# Wow Classic AH

How to build:

# React-Native 0.59

react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res

cd android
./gradlew assembleDebug
