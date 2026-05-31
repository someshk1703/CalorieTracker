import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "CalorieTracker",
  slug: "calorie-tracker",
  scheme: "calorietracker",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.calorietracker.mobile",
    infoPlist: {
      NSCameraUsageDescription: "CalorieTracker uses the camera to scan meals for nutrition estimates.",
      NSPhotoLibraryUsageDescription: "CalorieTracker lets you import meal photos for nutrition estimates."
    }
  },
  android: {
    package: "com.calorietracker.mobile",
    permissions: ["CAMERA", "READ_MEDIA_IMAGES"]
  },
  plugins: ["expo-router", "expo-camera", "expo-image-picker", "expo-sqlite"]
};

export default config;