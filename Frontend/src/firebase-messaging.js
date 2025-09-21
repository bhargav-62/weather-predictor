import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyQ_CG1zT8qRWybWb-EY95zFCuF4w3QgY",
  authDomain: "weather-predictor-notification.firebaseapp.com",
  projectId: "weather-predictor-notification",
  storageBucket: "weather-predictor-notification.appspot.com",
  messagingSenderId: "436361103161",
  appId: "1:436361103161:web:19a7da9b41142f6c9a7b30",
  measurementId: "G-R6F0JHSKSF"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (setTokenFound) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BMTYRNLDIrvCYnehZrfTlXbAZP0kavmEgnX-ooSd5s4NQBC-x30ldsQy8DJwTh9-Fvommxz7jEuzDrCUJPAGcxo"
    });
    if (currentToken) {
      setTokenFound(true);
      return currentToken;
    } else {
      setTokenFound(false);
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
