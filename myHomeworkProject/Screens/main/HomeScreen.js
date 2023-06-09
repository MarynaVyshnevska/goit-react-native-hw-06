import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

const MainTab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarActiveTintColor: "#ffffff",
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "#212121cc",
        tabBarStyle,
      }}
      initialRouteName="PostsScreen"
    >
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focuced, size, color }) => (
            <View style={styles.buttom}>
              <View
                style={[
                  {backgroundColor: focuced ? "#FF6C00" : "transparent"},
                  styles.buttom2,
                ]}
              >
                <AntDesign name="appstore-o" size={size} color={color} />
              </View>
            </View>
          ),


              headerShown: false,
        }}
        name="PostsScreen"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focuced, size, color }) => (
            <View style={styles.buttom}>
              <View
                style={{
                  backgroundColor: focuced ? "#FF6C00" : "transparent",
                  ...styles.buttom2,
                }}
              >
                <Octicons name="plus" size={size} color={color} />
              </View>
            </View>
          ),
          headerTitle: () => (
            <View>
              <Text style={styles.title}>Створити публікацію</Text>
            </View>
          ),
          headerStyle,
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PostsScreen");
              }}
              style={{ marginLeft: 16 }}
            >
              <View>
                <Octicons name="arrow-left" size={24} color="#212121" />
              </View>
            </TouchableOpacity>
          ),
        }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focuced, size, color }) => (
            <View style={styles.buttom}>
              <View
                style={{
                  backgroundColor: focuced ? "#FF6C00" : "transparent",
                  ...styles.buttom2,
                }}
              >
                <Feather name="user" size={size} color={color} />
              </View>
            </View>
          ),
          headerShown: false,
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}

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

const tabBarStyle = {
  height: 83,
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 82,
  paddingTop: 9,
  paddingRight: 82,
  paddingBottom: 34,
  borderTopWidth: 1,
  borderTopColor: "#0000004d",
};

const headerStyle = {
  borderBottomWidth: 1,
  borderBottomColor: "#0000004d",
};

/** */
      // screenOptions={({ route }) => ({
      //   tabBarShowLabel: false,
      //   // tabBarActiveTintColor: "#ffffff",
      //   tabBarActiveTintColor: "tomato",
      //   tabBarInactiveTintColor: "#212121cc",
      //   tabBarStyle,
      //   tabBarIcon: ({ focuced, size = 24, color }) => {
      //     switch (route.name) {
      //       case "PostsScreen":
      //         return (
      //           <View
      //             style={{
      //               backgroundColor: focuced ? "#FF6C00" : "green",
      //               ...styles.buttom2,
      //             }}
      //           >
      //             <AntDesign name="appstore-o" size={size} color={color} />
      //           </View>
      //         );
      //     }

      //   },
      // })}