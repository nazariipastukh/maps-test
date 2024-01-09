import React, {FC} from 'react';
import {Marker} from '@react-google-maps/api';

import {MarkerType} from "../../../interfaces/interface";

interface IProps {
    markers: MarkerType[];
    handleDragEnd: (id: number, event: google.maps.MapMouseEvent) => void;
    deleteMarker: (id: number) => void;
}

export const MarkersComponent: FC<IProps> = ({markers, handleDragEnd, deleteMarker}) => (
    <>
        {markers.map(marker => (
            <Marker
                key={marker.id}
                position={{lat: marker.lat, lng: marker.lng}}
                draggable={true}
                onDragEnd={(event) => handleDragEnd(marker.id, event)}
                onClick={() => deleteMarker(marker.id)}
                label={marker.id.toString()}
            />
        ))}
    </>
);