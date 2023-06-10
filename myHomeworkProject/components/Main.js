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
  const [routing, setRouting] = useState(useRoute(false));
  // const state = useSelector((state) => state);
  const stateChange = useSelector(selectStateChange);
  // const routing = useRoute(stateChange);
  // let routing = useRoute(false);

  useEffect(() => {
    dispatch(authStateChangeUser()).then(() => {
      setIsReady(true);
    });

    const timeout = setTimeout(() => {
      if (stateChange === true) {
        setRouting(useRoute(true));
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return null;
  }

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
