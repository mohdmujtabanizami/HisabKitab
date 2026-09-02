import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDBmF8942Fs4nbOPwzxOQa5pBQ6haKXn6Q",
  authDomain: "hisabkitab-e1fb5.firebaseapp.com",
  projectId: "hisabkitab-e1fb5",
  storageBucket: "hisabkitab-e1fb5.firebasestorage.app",
  messagingSenderId: "898617277415",
  appId: "1:898617277415:web:27658196c7f7ea9a991b42",
  measurementId: "G-79ZG7LLC0H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();