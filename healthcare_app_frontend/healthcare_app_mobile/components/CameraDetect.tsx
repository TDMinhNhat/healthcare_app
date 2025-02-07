// CameraDetect.tsx
import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from "react-native-vision-camera";
import useDetect from "../hooks/useDetect";

export default function CameraDetect() {
  const device = useCameraDevice("front");
  const { hasPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const { detectFace, isPending } = useDetect();

  const takePicture = async () => {
    if (camera.current && !isPending) {
      try {
        const photo = await camera.current.takePhoto({
          flash: "off",
        });
        console.log("Photo taken:", photo?.path);

        // Use the hook to detect face
        const result = await detectFace(photo.path);
        console.log("Detection result:", result);
      } catch (error) {
        console.error("Failed to take or detect photo:", error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      takePicture();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        photoQualityBalance="speed"
      />
      {isPending && (
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
