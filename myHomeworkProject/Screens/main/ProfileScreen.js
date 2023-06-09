import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { PostCountry } from "../../components/Post/Post";
import { authLogOut } from "../../redux/auth/authOperations";
import { auth, firestore, storage } from "../../firebase/config";
import { authSlice } from "../../redux/auth/authReducer";

const userAvatar = "../../assets/images/avatar_frog.jpg";
const wallpaper = "../../assets/images/photoBG.jpg";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);

  const { userId, login, email, avatar } = useSelector((state) => state);

  const sortedPostsByTimeCreate = (data) => {
    return data.sort((a, b) => {
      if (a.timeCreate < b.timeCreate) return 1;
      if (a.timeCreate > b.timeCreate) return -1;
      return 0;
    });
  };

  const getAllPostsByUserId = async () => {
    const firestoreRef = collection(firestore, "postsHomework");
    await onSnapshot(firestoreRef, (data) => {
      const sortedPosts = sortedPostsByTimeCreate(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      const postsByUserId = sortedPosts.filter(
        (item) => item.userId === userId
      );
      console.log("User posts", postsByUserId);
      setUserPosts(postsByUserId);
    });
  };

  useEffect(() => {
    getAllPostsByUserId();
  }, []);

  const logOut = () => {
    dispatch(authLogOut());
    navigation.navigate("Login");
  };

  const uploadAvatarToServer = async (newAvatar) => {
    try {
      const response = await fetch(newAvatar);
      const file = await response.blob();

      const path = `avatars/${userId}.jpeg`;

      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);

      const downloadedNewAvatar = await getDownloadURL(storageRef);
      // console.log("downloadedNewAvatar", downloadedNewAvatar);

      // console.log(auth.currentUser);
      await updateProfile(auth.currentUser, {
        photoURL: downloadedNewAvatar
      });
      const { uid, displayName, photoURL } = await auth.currentUser;
      console.log(uid, displayName, photoURL);

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          login: displayName,
          email,
          avatar: photoURL,
        })
      );
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("Error while adding avatar: ", errorMessage);
    }
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log("Нет доступа");
      return;
    }
    const imageResult = await ImagePicker.launchImageLibraryAsync();
    if (!imageResult.canceled) {
      uploadAvatarToServer(imageResult.uri);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imageBG} source={require(wallpaper)}>
        <View style={styles.containerUser}>
          <View style={styles.avatar}>
            {avatar === null ? (
              <ImageBackground
                source={require(userAvatar)}
                // source={require(defaultAvatarJp)}
                style={{ flex: 1, margin: 8 }}
                resizeMode="cover"
              >
                <Pressable
                  style={styles.deleteAvatarButton}
                  onPress={openImagePicker}
                >
                  <AntDesign name="close" size={20} color="#BDBDBD" />
                </Pressable>
              </ImageBackground>
            ) : (
              <ImageBackground
                source={{ uri: avatar }}
                // source={require(`${avatarDefailt}`)}
                style={{ flex: 1, margin: 8 }}
                resizeMode="cover"
              >
                <Pressable
                  style={styles.deleteAvatarButton}
                  onPress={openImagePicker}
                >
                  <AntDesign name="close" size={20} color="#BDBDBD" />
                </Pressable>
              </ImageBackground>
            )}
          </View>
          <TouchableOpacity onPress={logOut} style={styles.logoutButton}>
            <View>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>{login}</Text>
          <FlatList
            data={userPosts}
            renderItem={({ item }) => (
              <PostCountry data={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#FFFFFF",
    // paddingHorizontal: 16,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    // paddingBottom: 78,
    // justifyContent: "flex-end",
  },
  imageBG: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
  },
  containerUser: {
    flex: 1,
    marginTop: 147,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatar: {
    position: "absolute",
    width: 120,
    height: 120,
    // backgroundColor: "#F6F6F6",
    backgroundColor: "#FFFFFF",
    top: 0,
    left: "50%",
    borderRadius: 16,
    transform: [{ translateY: -60 }, { translateX: -60 }],
  },
  deleteAvatarButton: {
    display: "flex",
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: 1,
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: 81 }, { translateX: 14 }],
  },
  iconAdd: {
    width: 13,
    height: 13,
  },
  logoutButton: {
    display: "flex",
    width: 24,
    height: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: 1,
    position: "absolute",
    top: 20,
    right: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 92,
    textAlign: "center",
    fontFamily: "RobotoMedium",
    fontWeight: "500",
    fontSize: 30,
    color: "#212121",
    lineHeight: 35,
    letterSpacing: 0.01,
    marginBottom: 31,
  },
  list: {
    marginHorizontal: 16,
  },
});
