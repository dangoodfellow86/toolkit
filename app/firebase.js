import { initializeApp, getApp,getApps } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCgBgjBh1w84G6A-kdFUVAIbmhuXDt3vHg",
  authDomain: "ottracker-test.firebaseapp.com",
  projectId: "ottracker-test",
  storageBucket: "ottracker-test.appspot.com",
  messagingSenderId: "1009394709303",
  appId: "1:1009394709303:web:0ccade2b8ea29bc01de0b2"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, firestore, auth, storage};