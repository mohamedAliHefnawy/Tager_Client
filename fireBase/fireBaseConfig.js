import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkKkvfDLfCER1HlhA4hD6COlxXpT2lQok",
  authDomain: "elhabieb-d3522.firebaseapp.com",
  projectId: "elhabieb-d3522",
  storageBucket: "elhabieb-d3522.appspot.com",
  messagingSenderId: "25526606990",
  appId: "1:25526606990:web:e7af11352808f9c569fddf",
  measurementId: "G-9J6VDGCEJH",
};

const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app);
