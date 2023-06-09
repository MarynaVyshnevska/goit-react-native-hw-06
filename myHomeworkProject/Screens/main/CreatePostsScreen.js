import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { v4 as uuidv4 } from "uuid";

import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectUserId, selectUserLogin } from "../../redux/auth/authSelector";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const CreatePostsScreen = ({ navigation }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  /** *********Camera and Location */
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");
  const [area, setArea] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [commentsTotal, setCommentTotal] = useState("");

  const userId = useSelector((state) => state.userId);
  const login = useSelector((state) => state.login);
  // console.log(login, userId);

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      // console.log("photo -->", photo);
      setPhoto(photo.uri);
    } else {
      console.log("Camera is not ready. Please wait");
    }
  };

  useEffect(() => {
    const getCameraUse = async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg(
          "Prohibited for use. You need to grant access to use the camera"
        );
        return;
      }
    };

    const getLocationUse = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "Prohibited for use. You need to grant access to use the location"
        );
        return;
      }

      let coordinate = await Location.getCurrentPositionAsync({});
      setCoordinate(coordinate);
      const latitude = coordinate.coords.latitude;
      const longitude = coordinate.coords.longitude;
      const area = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      // console.log(latitude, longitude);
      if (area && area.length > 0) {
        // console.log(area);
        const { street, city, district, region, country } = area[0];
      } else {
        setErrorMsg("Mistake with area");
      }
      setArea(area[0]);
    };

    getCameraUse();
    getLocationUse();
  }, []);

  const onCreatePost = () => {
    uploadPostToServer();
    navigation.navigate("DefaultPostsScreen");

    setPostTitle("");
    setPostLocation("");
    setPhoto("");
    // setArea("");
    // setCoordinate("");
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();
    const path = `postImagesHomework/${uniquePostId}.jpeg`;

    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef);
    // console.log("processedPhoto", processedPhoto);

    return processedPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const newPost = {
      title: postTitle,
      photo,
      commentsTotal: 0,
      likes: 0,
      location: postLocation,
      area,
      coordinate,
      userId,
      login,
      timeCreate: Date.now(),
    };
    // console.log("newPost", newPost);
    try {
      const docRef = await addDoc(
        collection(firestore, "postsHomework"),
        newPost
      );
      // console.log("Post is loaded successfuly", docRef);
      // console.log("Hi!");
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("Error while adding doc: ", errorMessage);
    }
  };

  const keyboardHidden = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHidden}>
      <View style={styles.container}>
        <View style={styles.pictureContainer}>
          {photo ? (
            <View style={styles.camera}>
              <Image source={{ uri: photo }} style={styles.image} />
              <TouchableOpacity
                style={{
                  ...styles.pictureWindow,
                  backgroundColor: "#ffffff4d",
                }}
                onPress={() => setPhoto("")}
              >
                <MaterialCommunityIcons
                  name="camera-retake"
                  size={24}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
              <TouchableOpacity
                style={{ ...styles.pictureWindow, backgroundColor: "#ffffff" }}
                onPress={takePhoto}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={24}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </Camera>
          )}
        </View>
        {photo ? (
          <Text style={styles.loadText}>Редагувати фото</Text>
        ) : (
          <Text style={styles.loadText}>Завантажте фото</Text>
        )}
        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ marginBottom: isShowKeyboard ? 60 : 0 }}>
              <TextInput
                style={{ ...styles.input, marginTop: 48 }}
                onFocus={() => setIsShowKeyboard(true)}
                value={postTitle}
                onChangeText={(value) => setPostTitle(value.trim())}
                placeholder="Назва"
                placeholderTextColor="#BDBDBD"
              />
              <View style={styles.location}>
                <TextInput
                  style={{ ...styles.input, marginTop: 32, paddingLeft: 24 }}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={postLocation}
                  onChangeText={(value) => setPostLocation(value)}
                  placeholder="Місцевість"
                  placeholderTextColor="#BDBDBD"
                />
                <SimpleLineIcons
                  style={styles.locationIcon}
                  name="location-pin"
                  size={18}
                  color="#BDBDBD"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          {photo && postTitle && postLocation ? (
            <TouchableOpacity
              title={"Опублікувати"}
              style={styles.btnActive}
              activeOpacity={0.5}
              onPress={onCreatePost}
            >
              <Text
                style={[
                  styles.textBtn,
                  { color: postLocation && postTitle ? "#FFFFFF" : "#BDBDBD" },
                ]}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              title={"Опублікувати"}
              style={styles.btn}
              activeOpacity={0.5}
              onPress={onCreatePost}
            >
              <Text
                style={[
                  styles.textBtn,
                  { color: postLocation && postTitle ? "#FFFFFF" : "#BDBDBD" },
                ]}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: "#ffffff",
  },
  pictureContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
  },
  pictureWindow: {
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  loadText: {
    fontFamily: "RobotoRegular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 18.75,
    color: "#BDBDBD",
    marginTop: 8,
  },
  input: {
    fontFamily: "RobotoRegular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 18.75,
    color: "#212121",
    paddingBottom: 16,
    borderColor: "transparent",
    borderBottomColor: "#E8E8E8",
    borderWidth: 1,
  },
  location: {
    position: "relative",
  },
  locationIcon: {
    position: "absolute",
    left: 0,
    top: 32,
  },
  btn: {
    width: "100%",
    borderRadius: 100,
    height: 51,
    marginTop: 32,
    backgroundColor: "#F6F6F6",
  },
  btnActive: {
    width: "100%",
    borderRadius: 100,
    height: 51,
    marginTop: 32,
    backgroundColor: "#FF6C00",
  },
  textBtn: {
    fontFamily: "RobotoRegular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textAlign: "center",
    paddingTop: 16,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  camera: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    borderWidth: 1,
    borderColor: "#ffd700",
    marginTop: 30,
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    color: "#BDBDBD",
  },
});
