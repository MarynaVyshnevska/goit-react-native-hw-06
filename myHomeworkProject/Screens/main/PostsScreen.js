import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Octicons } from "@expo/vector-icons";

import DefaultPostsScreen from "../nested/DefaultPostsScreen";
import CommentsScreen from "../nested/CommentsScreen";
import MapScreen from "../nested/MapScreen";

const NestedScreen = createStackNavigator();
import { Feather } from "@expo/vector-icons";
import { authLogOut } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const PostsScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(authLogOut());
    navigation.navigate("Login");
  }

  return (
    <NestedScreen.Navigator
      initialRouteName="DefaultPostsScreen"
      // screenOptions={{ headerShown: false }}
    >
      <NestedScreen.Screen
        name="DefaultPostsScreen"
        component={DefaultPostsScreen}
        options={{
                    headerTitle: () => (
            <View>
              <Text style={styles.title}>Публікації</Text>
            </View>
          ),
          headerStyle,
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={logOut}
              style={{ marginRight: 16 }}
            >
              <View>
                <Feather name="log-out" size={24} color="#BDBDBD" />
              </View>
            </TouchableOpacity>
          ),
          headerLeft: false
        }}
      />
      <NestedScreen.Screen
        name="CommentsScreen"
        component={CommentsScreen}
        options={{
          title: "Коментарі",
          headerTitleAlign: "center",
          headerTitleStyle,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DefaultPostsScreen")}
              style={{ marginLeft: 16 }}
            >
              <View>
                <Octicons name="arrow-left" size={24} color="#212121cc" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Мапа",
          headerTitleAlign: "center",
          headerTitleStyle,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DefaultPostsScreen")}
              style={{ marginLeft: 16 }}
            >
              <View>
                <Octicons name="arrow-left" size={24} color="#212121cc" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;

const headerTitleStyle = {
  fontFamily: "RobotoRegular",
  fontWeight: "500",
  fontSize: 17,
  color: "#212121",
  letterSpacing: -0.408,
  lineHeight: 22,
};

const headerStyle = {
  borderBottomWidth: 1,
  borderBottomColor: "#0000004d",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "RobotoRegular",
    fontWeight: "500",
    fontSize: 17,
    color: "#212121",
    letterSpacing: -0.408,
    lineHeight: 22,
  },
  buttom: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttom2: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    borderBottomWidth: 1,
    borderTopColor: "#0000004d",
  },
});