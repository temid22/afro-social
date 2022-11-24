import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBd2oB9VClmw8iSVWGUjYHxEAvgn4Q6jqo',
  authDomain: 'tdgram-a51e1.firebaseapp.com',
  projectId: 'tdgram-a51e1',
  storageBucket: 'tdgram-a51e1.appspot.com',
  messagingSenderId: '617977475872',
  appId: '1:617977475872:web:1ee1a15cef18990297dd45',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
