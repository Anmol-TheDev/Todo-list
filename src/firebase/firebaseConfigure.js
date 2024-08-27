import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyCoDuGH9XTP-4dqSSrtT46ucThWz9ATKV0",
  authDomain: "chatapp-85370.firebaseapp.com",
  projectId: "chatapp-85370",
  databaseURL: "https://chatapp-85370-default-rtdb.firebaseio.com/",
  storageBucket: "chatapp-85370.appspot.com",
  messagingSenderId: "401219016647",
  appId: "1:401219016647:web:960196fca3869693df6be2",
  measurementId: "G-18HGD4321K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export default app;