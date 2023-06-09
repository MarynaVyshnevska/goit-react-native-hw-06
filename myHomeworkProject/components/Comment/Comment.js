import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export const Comment = ({ data, navigation }) => {
  // console.log(data);
  const { description, id, ownerPost, postId, timeCreate, dateComment, ownerCommentAvatar,
      ownerCommentId } = data;
  const currentUserId = useSelector((state) => state.userId);


  return (
    <View
      style={{
        ...styles.container,
        flexDirection: currentUserId === ownerCommentId ? "row-reverse" : "row",
      }}
    >
      {ownerCommentAvatar === null ? (
        <Image
          style={{
            ...styles.avatar,
            marginRight: currentUserId === ownerCommentId   ? 0 : 16,
            marginLeft: currentUserId === ownerCommentId   ? 16 : 0,
          }}
          source={require("../../assets/images/avatar_frog.jpg")}
        />
      ) : (
        <Image
          style={{
            ...styles.avatar,
            marginRight: currentUserId === ownerCommentId   ? 0 : 16,
            marginLeft: currentUserId === ownerCommentId   ? 16 : 0,
          }}
          source={{uri: ownerCommentAvatar}}
        />
      )}
      <View
        style={{
          ...styles.textContainer,
          borderTopRightRadius: currentUserId !== ownerCommentId ? 6 : 0,
          borderTopLeftRadius: currentUserId !== ownerCommentId ? 0 : 6,
        }}
      >
        <Text style={styles.textBody}>{description}</Text>
        <Text
          style={{
            ...styles.textDate,
            textAlign: currentUserId !== ownerCommentId ? "left" : "right",
          }}
        >
          {dateComment}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#ffffff",
    // flexDirection: currentUserId !== ownerPost ? 'row' : 'row-reverse',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  textContainer: {
    maxWidth: "90%",
    fontFamily: "RobotoRegular",
    fontWeight: "400",
    // marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: "#00000008",
    marginBottom: 24,
  },
  textBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
    textAlign: "left",
  },
  textDate: {
    fontSize: 10,
    lineHeight: 11.72,
    color: "#BDBDBD",
  },
});
