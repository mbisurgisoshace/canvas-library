import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6gs2HXZTlO12NzeuQ9TDxps6ijtN761E",
  authDomain: "todoapp-dd64e.firebaseapp.com",
  projectId: "todoapp-dd64e",
  storageBucket: "todoapp-dd64e.firebasestorage.app",
  messagingSenderId: "634035546537",
  appId: "1:634035546537:web:106dbcf930faf054907cb8",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
