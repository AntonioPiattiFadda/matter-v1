// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApikey = import.meta.env.VITE_FIREBASE_API_KEY;
//FIXME - change the firebaseConfig to your own firebase project configuration

const firebaseConfig = {
  apiKey: firebaseApikey,
  authDomain: 'pediclick-95cb6.firebaseapp.com',
  projectId: 'pediclick-95cb6',
  storageBucket: 'pediclick-95cb6.appspot.com',
  messagingSenderId: '558010134934',
  appId: '1:558010134934:web:3e4e0b58bd528f6d87adb7',
  measurementId: 'G-RSWF7K9WKW',
};

// const firebaseApikey = import.meta.env.VITE_FIREBASE_API_KEY;
// const firebaseConfig = {
//   apiKey: firebaseApikey,
//   authDomain: 'matter-invoice.firebaseapp.com',
//   projectId: 'matter-invoice',
//   storageBucket: 'matter-invoice.appspot.com',
//   messagingSenderId: '424685260423',
//   appId: '1:424685260423:web:c249731242d98c12a93222',
//   measurementId: 'G-V20C1PCLZM',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
