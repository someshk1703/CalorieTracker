import { CameraView, useCameraPermissions, type CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FoodLabelOverlay, ScanControls, type ScanMode } from "../../src/features/scan/ScanControls";
import { useMealAnalysis } from "../../src/features/scan/useMealAnalysis";
import { createLocalMediaReference } from "../../src/services/localMediaStorage";

export default function ScanScreen() {
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const { state, analyzeMeal } = useMealAnalysis("test-token");
  const labels = state.status === "succeeded" ? state.result.detectedFoods.map((food) => food.label) : [];
  const isBusy = state.status === "loading";

  async function finishAnalysis(sourceMethod: ScanMode, imageUri: string) {
    const mediaReference = createLocalMediaReference(imageUri);
    setLocalImageUri(mediaReference.localUri);
    const result = await analyzeMeal(sourceMethod, mediaReference.localUri);
    if (result) {
      router.push({
        pathname: "/meal-results",
        params: {
          analysis: JSON.stringify(result),
          imageUri: mediaReference.localUri,
          sourceMethod
        }
      });
    }
  }

  async function captureMeal() {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        return;
      }
    }

    const picture: CameraCapturedPicture | undefined = await cameraRef.current?.takePictureAsync({ quality: 0.72, exif: false });
    if (picture?.uri) {
      await finishAnalysis("camera", picture.uri);
    }
  }

  async function importMealPhoto() {
    setMode("photo_import");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const selection = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.78
    });

    if (!selection.canceled && selection.assets[0]?.uri) {
      await finishAnalysis("photo_import", selection.assets[0].uri);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.preview}>
        {cameraPermission?.granted ? <CameraView ref={cameraRef} facing="back" style={styles.camera} /> : null}
        {localImageUri ? <Image source={{ uri: localImageUri }} style={styles.capturedImage} /> : null}
        <View style={styles.topBar}>
          <Link asChild href="/"><Pressable style={styles.roundButton}><Text style={styles.roundButtonText}>x</Text></Pressable></Link>
          <Text style={styles.brand}>Cal AI</Text>
          <View style={styles.roundButton}><Text style={styles.roundButtonText}>?</Text></View>
        </View>
        {!cameraPermission?.granted ? (
          <View style={styles.permissionPanel}>
            <Text style={styles.previewText}>Camera access needed</Text>
            <Pressable accessibilityLabel="Allow camera access" onPress={requestCameraPermission} style={styles.permissionButton}>
              <Text style={styles.permissionButtonText}>Allow Camera</Text>
            </Pressable>
          </View>
        ) : null}
        {isBusy ? <Text style={styles.statusPill}>Analyzing meal</Text> : null}
        <FoodLabelOverlay labels={labels} />
      </View>
      {state.status === "failed" ? <Text style={styles.errorText}>{state.message}</Text> : null}
      <ScanControls disabled={isBusy} mode={mode} onCapture={captureMeal} onImport={importMealPhoto} onModeChange={setMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  camera: { height: "100%", width: "100%" },
  capturedImage: { borderColor: "#FFFFFF", borderWidth: 2, bottom: 20, height: 112, position: "absolute", right: 20, width: 84 },
  errorText: { color: "#B91C1C", paddingHorizontal: 16 },
  permissionButton: { backgroundColor: "#16A34A", paddingHorizontal: 18, paddingVertical: 12 },
  permissionButtonText: { color: "#FFFFFF", fontWeight: "800" },
  permissionPanel: { alignItems: "center", gap: 16 },
  preview: { alignItems: "center", backgroundColor: "#0F172A", flex: 1, justifyContent: "center" },
  previewText: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  roundButton: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  roundButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  screen: { backgroundColor: "#F8FAFC", flex: 1 },
  statusPill: { backgroundColor: "#F8FAFC", borderRadius: 18, color: "#111827", fontWeight: "800", paddingHorizontal: 14, paddingVertical: 8, position: "absolute", top: 92 },
  topBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", left: 20, position: "absolute", right: 20, top: 52 }
});