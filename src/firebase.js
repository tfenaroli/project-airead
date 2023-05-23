import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile,
} from 'firebase/auth';
import {
  doc, getDoc, getFirestore, setDoc,
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, getDownloadURL, listAll,
} from 'firebase/storage';
import { ActionTypes } from './actions';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBjQFRMKpSsfef5jb89PjIe7yDDCXEp31s',
  authDomain: 'airead.firebaseapp.com',
  projectId: 'airead',
  storageBucket: 'airead.appspot.com',
  messagingSenderId: '1064959847191',
  appId: '1:1064959847191:web:0b6e632e679ebd9af46552',
  measurementId: 'G-SNL9THW1S2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
export const auth = getAuth(app);

export function createUserDoc(email, displayName, age) {
  return (dispatch) => {
    setDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {
      email,
      displayName,
      age,
    })
      .then(() => {
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { email, displayName, age },
        });
      });
  };
}

export function fetchUserDoc() {
  return (dispatch) => {
    getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      dispatch({
        type: ActionTypes.SET_USER,
        payload: docSnap.data(),
      });
    });
  };
}

export function login(email, password, errorCallback, navigate) {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate('/');
      })
      .catch((error) => {
        errorCallback(error.message);
      });
  };
}

export function signup(email, password, displayName, age, errorCallback) {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName,
        }).then(() => {
          dispatch(createUserDoc(
            email,
            displayName,
            age,
          ));
        });
      })
      .catch((error) => {
        errorCallback(error.message);
      });
  };
}

export function logOut(navigate) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.HIDE_USER });
    auth.signOut();
    navigate('/');
  };
}

export function uploadFile(file) {
  const storageRef = ref(storage, file.name);

  return uploadBytes(storageRef, file)
    .then(() => getDownloadURL(storageRef))
    .then((downloadURL) => {
      console.log('File uploaded successfully. Download URL:', downloadURL);
      return downloadURL;
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
}

export async function getAllFiles() {
  try {
    const storageRef = ref(storage);
    const items = await listAll(storageRef);
    const fileURLs = items.items.map((item) => item.fullPath);
    return fileURLs;
  } catch (error) {
    console.error('Error fetching files from Firebase Storage:', error);
    throw error;
  }
}