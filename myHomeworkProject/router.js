import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import RegistrationScreen from "./Screens/auth/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import HomeScreen from "./Screens/main/HomeScreen";

const AuthStack = createStackNavigator();

export const useRoute = (isAuth) => {
    console.log('hello');

  if (!isAuth) {
    return (
    // routing = (
      <AuthStack.Navigator style={styles.container}>
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Register"
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={HomeScreen}
        />
      </AuthStack.Navigator>
    );
  } else {
    //  routing = (
    return(
      <HomeScreen/>
    );
  }
  // return routing;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 250,
  },
  innerBox: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 250,
  },
  text: {
    fontFamily: "RobotoRegular",
  },
});
