"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Friend } from "../page";
import L from "leaflet";

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

interface MapProps {
    friends: Friend[];
}

export default function Map({ friends }: MapProps) {
    const defaultPosition: [number, number] = [-6.223958802543582, 106.70812596254999]; // set di cbd ciledug as default 
    return (
        <div className="w-full h-full overflow-hidden border border-gray-300">
            <MapContainer 
                center={defaultPosition}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={defaultPosition} icon={defaultIcon}>
                        <Popup>Pusat Dunia CBD CILEDUG</Popup>
                    </Marker>

                    {friends.map((friend) => (
                    <Marker key={friend.id} position={[friend.lat, friend.lng]} icon={defaultIcon}>
                        <Popup> {friend.name} </Popup>
                    </Marker>
                ))}

            </MapContainer>
        </div>
    );
}