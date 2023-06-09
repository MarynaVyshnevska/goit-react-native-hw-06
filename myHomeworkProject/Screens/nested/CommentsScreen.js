import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Keyboard,
  ScrollView,
} from "react-native";

import { Comment } from "../../components/Comment/Comment";
import { AntDesign } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

import { firestore } from "../../firebase/config";
import { useSelector } from "react-redux";

const CommentsScreen = ({ route, navigation }) => {
  // console.log(route.params);
  const { title, image, commentsTotal, id, photo, login, userId } = route.params.data;
  const [description, setDescription] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const postId = id;
  const ownerPost = userId;
  const ownerCommentAvatar = useSelector((state) => state.avatar);
  const ownerCommentId = useSelector((state) => state.userId);

  console.log('ownerCommentAvatar', ownerCommentAvatar);
  console.log('ownerCommentId', ownerCommentId);

  useEffect(() => {
    getAllComments();
  }, []);

  const handleCreateComment = async () => {
    const minute = new Date().toLocaleString("en", {minute: "2-digit"});
    const hour = new Date().toLocaleString("en", {hour: "2-digit", hour12: false});
    const day = new Date().toLocaleString("en", {day: "numeric"});
    const month = format(new Date(), "MMMM", { locale: uk });
    const year = new Date().toLocaleString("en", { year: "numeric" });
    const dateComment = `${day} ${month}, ${year} | ${hour}:${minute}`;
    const newComment = {
      login,
      description,
      timeCreate: Date.now(),
      dateComment,
      ownerPost,
      ownerCommentAvatar,
      ownerCommentId
    };

    console.log(newComment);
    try {
      const commentRef = doc(firestore, "postsHomework", postId);
      await updateDoc(commentRef, { commentsTotal: commentsList.length + 1 });
      await addDoc(collection(commentRef, "comments"), newComment);
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("rror while adding doc: ", errorMessage);
    }
    // setNewComment(newComment);
    setDescription("");
  };

  const sortedCommentsByTimeCreate = (data) => {
    return data.sort((a, b) => {
      if (a.timeCreate < b.timeCreate) return -1;
      if (a.timeCreate > b.timeCreate) return 1;
      return 0;
    });
  };

  const getAllComments = async () => {
    try {
      const commentRef = doc(collection(firestore, "postsHomework"), postId);
      await onSnapshot(collection(commentRef, "comments"), (data) => {
        const sortedComments = sortedCommentsByTimeCreate(
          data.docs.map((doc) => ({ ...doc.data() }))
        );
        setCommentsList(sortedComments);
      });
    } catch (error) {}
  };

  const keyboardHidden = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <ScrollView style={styles.container} onPress={keyboardHidden}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.createComment,
            { marginBottom: isShowKeyboard ? 90 : 0 },
          ]}
        >
          <Image style={styles.image} source={photo ? { uri: photo } : image} />
          <FlatList
            data={commentsList}
            renderItem={({ item }) => (
              <Comment data={item} navigation={navigation} />

            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
          <View>
            <TextInput
              style={styles.input}
              onFocus={() => setIsShowKeyboard(true)}
              value={description}
              onChangeText={(value) => setDescription(value)}
              placeholder="Коментувати..."
              placeholderTextColor="#BDBDBD"
            />
            <Pressable style={styles.btn} onPress={handleCreateComment}>
              <AntDesign name="arrowup" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: "100%",
    borderRadius: 8,
    height: 240,
  },
  list: {
    marginTop: 32,
  },
  input: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19.36,
    color: "#212121",
    padding: 16,
    borderColor: "#E8E8E8",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
  },
  btn: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 50,
    width: 34,
    height: 34,
    padding: 10,
    backgroundColor: "#FF6C00",
  },
});
