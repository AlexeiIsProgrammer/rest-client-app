import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD_WSexN3Xw63ei-APzjDhZYL4Lnm-jVZc',
  authDomain: 'rest-api-aaa-a1443.firebaseapp.com',
  projectId: 'rest-api-aaa-a1443',
  storageBucket: 'rest-api-aaa-a1443.firebasestorage.app',
  messagingSenderId: '129238390479',
  appId: '1:129238390479:web:7ae47c66c8f58c124889ba',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  await addDoc(collection(db, 'users'), {
    uid: user.uid,
    authProvider: 'local',
    email,
  });
  return user;
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
