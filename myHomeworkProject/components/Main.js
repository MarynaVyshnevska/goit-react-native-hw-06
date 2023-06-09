import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//** Navigation */
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";

import { authStateChangeUser } from "../redux/auth/authOperations";

const Main = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const state = useSelector((state) => state);
  const { stateChange } = useSelector((state) => state);

  useEffect(() => {
    dispatch(authStateChangeUser()).then(() => {
      setIsReady(true);
    });
  }, []);

  console.log("state", state);
  console.log(stateChange);


  if (!isReady) {
    return null;
  }

  //**Автоматический вход в приложение если есть state - Не работает, */
  //** Работает только в случае первоначального null */
  // const routing = useRoute(stateChange);
  const routing = useRoute();

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
