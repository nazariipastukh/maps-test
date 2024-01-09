import {initializeApp} from 'firebase/app';
import {
    getFirestore,
    GeoPoint,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCVStmYSRCc2w2UsfFqaTkjXxESzPncl9I",
    authDomain: "maps-test-c13a0.firebaseapp.com",
    projectId: "maps-test-c13a0",
    storageBucket: "maps-test-c13a0.appspot.com",
    messagingSenderId: "944105474360",
    appId: "1:944105474360:web:260dbed9121076047499cd",
    measurementId: "G-1J2N4VR1FH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
    GeoPoint,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
};