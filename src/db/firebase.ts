import React from "react";
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, getDocs} from 'firebase/firestore';

import {MarkerType} from '../interfaces/interface';

const firebaseApi = 'AIzaSyCVStmYSRCc2w2UsfFqaTkjXxESzPncl9I'

const firebaseConfig = {
    apiKey: firebaseApi,
    authDomain: 'maps-test-c13a0.firebaseapp.com',
    projectId: 'maps-test-c13a0',
    storageBucket: 'maps-test-c13a0.appspot.com',
    messagingSenderId: '944105474360',
    appId: '1:944105474360:web:260dbed9121076047499cd',
    measurementId: 'G-1J2N4VR1FH',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadMarkersFromFirebase = async (setMarkers: React.Dispatch<React.SetStateAction<MarkerType[]>>) => {
    try {
        const questsRef = collection(db, 'quests');
        const snapshot = await getDocs(questsRef);
        const loadedMarkers: MarkerType[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const marker: MarkerType = {
                id: data.id,
                lat: data.location.latitude,
                lng: data.location.longitude,
            };
            loadedMarkers.push(marker);
        });

        setMarkers(loadedMarkers);
    } catch (error) {
        console.error('Error loading markers:', error);
    }
};

export {
    db,
    loadMarkersFromFirebase
};