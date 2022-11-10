import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { AutoFocus, Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import Draw from "./Draw";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>;
  }

  let takePic = async () => {
    let options = {
      base64: true,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    return <Draw image={photo}></Draw>;
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View
        style={{
          alignSelf: "center",
          flex: 1,
          alignItems: "center",
          marginTop: 700,
        }}
      >
        <TouchableOpacity
          onPress={takePic}
          style={{
            width: 70,
            height: 70,
            bottom: 0,
            borderRadius: 50,
            backgroundColor: "rgba(200, 200, 200, 0)",
            borderColor: "white",
            borderWidth: 3,
          }}
        />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    marginTop: 700,
    alignSelf: "center",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
