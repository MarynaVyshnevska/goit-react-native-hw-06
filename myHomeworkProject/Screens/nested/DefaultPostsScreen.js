import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";

import { Post } from "../../components/Post/Post";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import { useSelector } from "react-redux";

const DefaultPostsScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const { userId, login, email, avatar } = useSelector((state) => state);
  // console.log(userId, login, email, avatar);

  const sortedPostsByTimeCreate = (data) => {
    return data.sort((a, b) => {
      if (a.timeCreate < b.timeCreate) return 1;
      if (a.timeCreate > b.timeCreate) return -1;
      return 0;
    });
  };

  const getAllPosts = async () => {
    const firestoreRef = collection(firestore, "postsHomework");
    await onSnapshot(firestoreRef, (data) => {
      const sortedPosts = sortedPostsByTimeCreate(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setPosts(sortedPosts);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // console.log("posts ---->", posts);
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {avatar === null ? (
          <Image
            style={styles.avatar}
            source={require("../../assets/images/avatar_frog.jpg")}
            // source={{uri:avatar}}
          />
        ) : (
          <Image style={styles.avatar} source={{ uri: avatar }} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{login}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post data={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default DefaultPostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
  },
  userContainer: {
    justifyContent: "flex-start",
    paddingVertical: 32,
    flexDirection: "row",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  info: {
    marginLeft: 8,
    // verticalAlign: 'middle',
    paddingVertical: 16,
  },
  name: {
    fontFamily: "RobotoBold",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 15.23,
    color: "#212121",
  },
  email: {
    fontFamily: "RobotoRegular",
    fontWeight: "400",
    fontSize: 11,
    lineHeight: 12.89,
    color: "#212121cc",
  },
});
