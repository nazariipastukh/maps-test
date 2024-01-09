import React, {useState, useEffect} from 'react';
import {GoogleMap, LoadScript} from '@react-google-maps/api';

import {db, GeoPoint, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp} from '../../db/firebase';
import {ButtonsComponent} from '../ButtonComponent';
import {MarkersComponent} from './Markers'
import {MarkerType} from "../../interfaces/interface";

export const MapComponent: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [latestCoords, setLatestCoords] = useState<google.maps.LatLngLiteral>({ lat: 40, lng: -74.5 });

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
            lng: event.latLng.lng()
        };

        setMarkers([...markers, newMarker]);
        setLatestCoords({lat: newMarker.lat, lng: newMarker.lng});

        await addDoc(collection(db, 'quests'), {
            location: new GeoPoint(newMarker.lat, newMarker.lng),
            timestamp: serverTimestamp(),
            next: null
        });
    };

    const deleteMarker = (id: number) => setMarkers(markers.filter(marker => marker.id !== id));

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

    const handleDragEnd = (id: number, event: google.maps.MapMouseEvent) => {
        updateMarker(id, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });

        const questRef = doc(db, 'quests', id.toString());
        updateDoc(questRef, {
            location: new GeoPoint(event.latLng.lat(), event.latLng.lng())
        });
    };

    const mapsApi = process.env.REACT_APP_API_MAPS

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