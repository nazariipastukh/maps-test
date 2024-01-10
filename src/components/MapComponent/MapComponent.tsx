import React, {useState, useEffect} from 'react';
import {GoogleMap, LoadScript} from '@react-google-maps/api';

import {
    addDoc,
    collection,
    getDocs,
    GeoPoint,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    doc,
    getDoc,
    query,
    where
} from 'firebase/firestore'
import {db, loadMarkersFromFirebase} from '../../db/firebase';

import {ButtonsComponent} from '../ButtonComponent';
import {MarkersComponent} from './Markers'
import {MarkerType} from "../../interfaces/interface";

export const MapComponent: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [latestCoords, setLatestCoords] = useState<google.maps.LatLngLiteral>({lat: 49.8326598, lng: 23.9298351});

    useEffect(() => {
        loadMarkersFromFirebase(setMarkers);
    }, []);

    const onMapLoad = (map: google.maps.Map) => setMap(map);

    useEffect(() => {
        if (map && latestCoords) {
            map.panTo(latestCoords);
        }
    }, [map, latestCoords]);

    const addMarker = async (event: google.maps.MapMouseEvent) => {
        const newMarker: MarkerType = {
            id: markers.length + 1,
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setMarkers([...markers, newMarker]);
        setLatestCoords({lat: newMarker.lat, lng: newMarker.lng});

        const questsRef = collection(db, 'quests');
        await addDoc(questsRef, {
            id: newMarker.id,
            location: new GeoPoint(newMarker.lat, newMarker.lng),
            timestamp: serverTimestamp(),
            next: null,
        });
    };

    const deleteMarker = async (id: number) => {
        try {
            const questsRef = collection(db, 'quests');
            const q = query(questsRef, where('id', '==', id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            const newMarkers = markers.filter(marker => marker.id !== id);
            setMarkers(newMarkers);
        } catch (error) {
            console.error(`Error deleting marker from Firebase: ${error}`);
        }
    };

    const deleteAllMarkers = async () => {
        setMarkers([]);
        const questsRef = collection(db, 'quests');
        const snapshot = await getDocs(questsRef);

        snapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
    };

    const updateMarker = (id: number, newCoords: google.maps.LatLngLiteral) => {
        setMarkers(markers.map(marker => (marker.id === id ? {...marker, ...newCoords} : marker)));
    };

    const handleDragEnd = async (id: number, event: google.maps.MapMouseEvent) => {
        const questRef = doc(db, 'quests', id.toString());
        const docSnapshot = await getDoc(questRef);

        if (docSnapshot.exists()) {
            updateDoc(questRef, {location: new GeoPoint(event.latLng.lat(), event.latLng.lng())});
        } else {
            console.warn(`Document with ID ${id} doesn't exist.`);
        }

        updateMarker(id, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    };

    const mapsApi = 'AIzaSyDlCbg2r5oHeIJDNWUYcqVRUMSsCgQvCNw'

    return (
        <LoadScript googleMapsApiKey={mapsApi}>
            <GoogleMap
                mapContainerStyle={{width: '100%', height: '80vh'}}
                center={latestCoords}
                zoom={9}
                onLoad={onMapLoad}
                onClick={(event) => addMarker(event)}
                options={{disableDefaultUI: true}}
            >
                <MarkersComponent
                    markers={markers}
                    handleDragEnd={handleDragEnd}
                    deleteMarker={deleteMarker}
                />
            </GoogleMap>

            <ButtonsComponent deleteAll={deleteAllMarkers}/>
        </LoadScript>
    );
};