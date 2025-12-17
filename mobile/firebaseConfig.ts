import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { salvarNotificacaoToken } from "./services/usuarios/usuario-service";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export async function requestWebToken(){
    const messaging = getMessaging(app);
    getToken(messaging, { vapidKey: process.env.EXPO_PUBLIC_FIREBASE_KEY }).then((currentToken) => {
    if (currentToken) {
        salvarNotificacaoToken(currentToken);
    } else {
        console.log('No registration token available. Request permission to generate one.');
        requestPermission();
    }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
}

export async function ListenerFCM(){
    const messaging = getMessaging(app)
    onMessage(messaging, async (payload) => {
        console.log('Message received. ', payload);
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            registration.showNotification(payload.notification?.title || "Nova mensagem", {
                body: payload.notification?.body,
                icon: "./assets/images/logo_app_1024.png",
            });
        }
    });
}

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    })
}