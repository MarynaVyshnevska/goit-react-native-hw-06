import React, { useState, useCallback } from "react";
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { authLogin } from "../../redux/auth/authOperations";

const initialState = {
  email: "",
  password: "",
};

SplashScreen.preventAutoHideAsync();

export default function LoginScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  // const [isReady, setIsReady] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);

  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();

  const [isReady] = useFonts({
    PlayfairDisplayRegular: require("../../assets/fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf"),
    RobotoBold: require("../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    RobotoMedium: require("../../assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoRegular: require("../../assets/fonts/Roboto/Roboto-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const keyboardHidden = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    // console.log(state);
  };

  const onLogin = () => {
    keyboardHidden();
    console.log('enter to app', state);

    dispatch(authLogin(state));
    setState(initialState);
    navigation.navigate('Home')
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHidden}>
      <ImageBackground
        style={styles.imageBG}
        source={require("../../assets/images/photoBG.jpg")}
      >
        <View style={styles.container} onLayout={onLayoutRootView}>
          <View
            style={{
              ...styles.form,

              width: width - 16 * 2,
            }}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Увійти</Text>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={{ marginBottom: isShowKeyboard ? 60 : 0 }}>
                <TextInput
                  style={styles.input}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                  placeholder="Адреса електронної пошти"
                  placeholderTextColor="#BDBDBD"
                />
                <View>
                  <TextInput
                    style={styles.input}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.password}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                    placeholder="Пароль"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={isShowPassword}
                  />
                  <Pressable
                    onPress={() => {
                      setIsShowPassword(!isShowPassword);
                    }}
                    style={styles.showContainer}
                  >
                    <Text style={styles.textShowPass}>
                      {isShowPassword ? "Показати" : "Сховати"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
            <TouchableOpacity
              style={styles.btnLogin}
              activeOpacity={0.5}
              onPress={onLogin}
            >
              <Text style={styles.textLogin}>Увійти</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
              style={styles.link}
            >
              <Text style={styles.textLink}>
                Не має акаунту? Зареєструватися
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  imageBG: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  container: {
    // position: 'relative',
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 144,
    justifyContent: "flex-end",
  },

  form: {
    width: "100%",
    paddingTop: 32,
  },
  header: {
    marginBottom: 33,

    // lineHeight:
  },
  title: {
    textAlign: "center",
    fontFamily: "RobotoMedium",
    fontWeight: "500",
    fontSize: 30,
    color: "#212121",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 16,
    marginBottom: 16,
    fontFamily: "RobotoRegular",
    fontSize: 16,
    fontWeight: 400,
    color: "#212121",
    lineHeight: 18.75,
  },
  showContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "transparent",
  },
  textShowPass: {
    fontSize: 16,
    color: "#1B4371",
    fontFamily: "RobotoRegular",
    fontWeight: 400,
  },
  btnLogin: {
    marginTop: 27,
    width: "100%",
    height: 50,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  textLogin: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "RobotoRegular",
    fontWeight: 400,
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
  },
  textLink: {
    textAlign: "center",
    fontFamily: "RobotoRegular",
    fontWeight: 400,
    fontSize: 16,
    color: "#1B4371",
  },
});
