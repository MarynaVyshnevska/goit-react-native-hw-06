import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

//** Store */
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store, persistor} from './redux/store';
import Main from "./components/Main";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady] = useFonts({
    PlayfairDisplayRegular: require("./assets/fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf"),
    RobotoBold: require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoRegular: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
  });

    const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main onLayout={onLayoutRootView} />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // fontFamily: "PlayfairDisplayRegular",
    fontSize: 250,
  },
  innerBox: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 250,
  },
  text: {
    fontFamily: "RobotoRegular",
    // fontSize: 150,
  },
});
