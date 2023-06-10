import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//** Navigation */
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";

import { authStateChangeUser } from "../redux/auth/authOperations";
import { selectStateChange } from "../redux/auth/authSelector";

const Main = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const state = useSelector((state) => state);
  const stateChange = useSelector(selectStateChange);
  const routing = useRoute(stateChange);
  // const routing = useRoute(false);

  useEffect(() => {
    // console.log(stateChange);
    // console.log("state", state);
    // dispatch(authStateChangeUser());
    dispatch(authStateChangeUser()).then(() => {
      setIsReady(true);
    });
  }, []);

    console.log(stateChange);
    console.log("state", state);

  if (!isReady) {
    return null;
  }

  //**Автоматический вход в приложение если есть state - Не работает, */
  //** Работает только в случае первоначального null */
  // const routing = useRoute(true);
  // if (stateChange === true) {
  //   // routing = useRoute(true);
  //   return routing = useRoute(true);
  // }

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
