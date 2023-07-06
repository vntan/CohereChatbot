import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  updateProfile 
} from "firebase/auth";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB03RomAk275Pc4NnCakRGu_Yz17ZXjPas",
  authDomain: "coherechatbot.firebaseapp.com",
  projectId: "coherechatbot",
  storageBucket: "coherechatbot.appspot.com",
  messagingSenderId: "729720254020",
  appId: "1:729720254020:web:3319662df8c6fb74da5611",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    // signOut(auth);
    return user;
  } catch (err) {
    return null;
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    //alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    //alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    //alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const changePassword = async (newPassword) => {
  const user = auth().currentUser;

  try {
    await updatePassword(user, newPassword);
    console.log("Password Updated!");
  } catch (err) {
    console.log(err);
  }
};

const getCurrentUser = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  return user;
};

const updateUserProfile = async (name, photoURL) => {
  const auth = getAuth();
  try {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
    console.log("User Updated!");
  } catch (err) {
    console.log(err);
  }
}

export {
  auth,
  signInWithGoogle,
  signInWithEmailAndPassword,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  changePassword,
  getCurrentUser,
  updateUserProfile
};
