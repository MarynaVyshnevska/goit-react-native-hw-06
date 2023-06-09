import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { authSlice } from "../../redux/auth/authReducer";
import { auth } from "../../firebase/config";

const { updateUserProfile, authStateChange, authLogOutUser } =
  authSlice.actions;

export const authRegister =
  ({ login, email, password, avatar }) =>
  async (dispatch, getState) => {
    try {
      const newMan = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("new man", newMan);

      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: avatar,
      });

      const { uid, displayName, photoURL } = await auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
          email,
          avatar: photoURL,
        })
      );
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("errorMessage", errorMessage);
    }
  };

export const authLogin =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user--->", user);

      const { uid, displayName, photoURL } = auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
          email,
          avatar: photoURL,
        })
      );
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("errorMessage", errorMessage);
    }
  };

export const authLogOut = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authLogOutUser());
  } catch (error) {
    console.log("error", error);
    const errorMessage = error.message;
    console.log("errorMessage", errorMessage);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        const userUpdateProfile = {
          userId: uid,
          email: email,
          login: displayName,
          avatar: photoURL,
        };
        dispatch(updateUserProfile(userUpdateProfile));
        dispatch(authStateChange({ stateChange: true }));
      }
    } catch (error) {
      console.log("error", error);
      const errorMessage = error.message;
      console.log("errorMessage", errorMessage);
    }
  });
};
