// CameraDetect.tsx
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  Frame,
  useFrameProcessor,
  useCameraDevice,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
export default function CameraDetect() {
  const device = useCameraDevice("front");
  const [isProcessing, setIsProcessing] = useState(false);
  const { hasPermission } = useCameraPermission();


  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No camera permission</Text>
      </View>
    );
  }
  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No camera device</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}// Điều chỉnh tần suất xử lý frame (fps)
      />
      {isProcessing && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Detecting Faces...</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Face Detection</Text>
        <Text style={styles.infoText}>Front Camera</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -75,
    marginTop: -50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  infoContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  faceBox: {
    marginBottom: 10,
  },
});
