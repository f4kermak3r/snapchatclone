import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Canvas,
  Path,
  Image,
  useImage,
  useCanvasRef,
  center,
} from "@shopify/react-native-skia";
import * as MailComposer from "expo-mail-composer";
import ColorPicker from "react-native-wheel-color-picker";
import ViewShot from "react-native-view-shot";

import Textas from "./Textas";

export default function Draw({ image }) {
  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState("red");
  const [allowDrawing, setAllowDrawing] = useState(false);
  const [allowColoring, setAllowColoring] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const ref = useCanvasRef();
  const viewshot = useRef();

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }

    checkAvailability();
  }, []);

  const pan = Gesture.Pan()
    .onStart((g) => {
      if (allowDrawing) {
        const newPaths = [...paths];
        newPaths[paths.length] = {
          segments: [],
          color,
        };
        newPaths[paths.length].segments.push(`M ${g.x} ${g.y}`);
        setPaths(newPaths);
      }
    })
    .onUpdate((g) => {
      if (allowDrawing) {
        const index = paths.length - 1;
        const newPaths = [...paths];

        if (newPaths?.[index]?.segments) {
          newPaths[index].segments.push(`L ${g.x} ${g.y}`);
          newPaths[index].color = color;
          setPaths(newPaths);
        }
      }
    })
    .minDistance(1);

  const imagas = useImage(image.uri);

  const sendEmail = (file) => {
    var options = {};
    options = {
      subject: "photo",
      body: "text",
      attachments: [file],
    };
    MailComposer.composeAsync(options);
  };

  const captureAndShareScreenshot = () => {
    viewshot.current.capture().then((uri) => {
      console.log(uri);
      sendEmail(uri);
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <ViewShot
            ref={viewshot}
            options={{ format: "jpg", quality: 0.9 }}
            style={styles.viewShot}
          >
            <Canvas style={{ flex: 8 }} ref={ref}>
              {imagas && (
                <Image
                  image={imagas}
                  fit={"fill"}
                  width={Dimensions.get("window").width}
                  height={Dimensions.get("window").height}
                />
              )}

              {allowDrawing &&
                paths.map((p, index) => (
                  <Path
                    key={index}
                    path={p.segments.join(" ")}
                    strokeWidth={20}
                    style="stroke"
                    color={p.color}
                  />
                ))}
              {showAuthor && <Textas />}
            </Canvas>
          </ViewShot>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                setAllowDrawing(!allowDrawing);
                setPaths([]);
              }}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>Paint</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => setAllowColoring(!allowColoring)}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>Color</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowAuthor(!showAuthor)}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Author Sticker
              </Text>
            </TouchableOpacity>
            {isAvailable && (
              <TouchableOpacity
                style={styles.button}
                onPress={captureAndShareScreenshot}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>Send</Text>
              </TouchableOpacity>
            )}
          </View>

          {allowColoring && (
            <ColorPicker
              color={color}
              swatchesOnly={false}
              onColorChangeComplete={(color) => setColor(color)}
              thumbSize={40}
              sliderSize={60}
              noSnap={true}
              row={false}
              swatchesLast={true}
              swatches={true}
              discrete={false}
              style={styles.colorPicker}
            />
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    width: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    right: 0,
    bottom: 310,
    elevation: 100,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    textAlign: "center",
  },

  colorPicker: {
    position: "absolute",
    bottom: 40,
    left: 0,
  },

  sendButton: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 500,
    padding: 10,
    borderRadius: 5,
    right: 0,
  },

  viewShot: {
    backgroundColor: "none",
    flex: 1,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
