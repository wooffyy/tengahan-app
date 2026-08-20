"use client";
import { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Friend, Place } from "./types/index";
import { calculateCentroid } from "./utils/centroid";
import { getNearbyPlaces } from "./utils/overpass";
import Sidebar from "./components/Sidebar";

const Map = dynamic(() => import("./components/Map"), { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }
);

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const center = calculateCentroid(friends) || [0, 0];

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    const isAdminExist = friends.some((friend) => friend.isAdmin);
    if (isAdminExist) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setFriends((prev) => {
        if (prev.some((f) => f.isAdmin)) return prev;

        const newFriend: Friend = {
          id: crypto.randomUUID(),
          name: inputName || "Saya (Admin)",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isAdmin: true,
        };

        return [...prev, newFriend];
      });

      setInputName("");
    }, 
    (error) => {
      alert("Error getting location: " + error.message);
    });
  };

  useEffect(() => {
    handleGetMyLocation();
  }, []);

  const handleSearch = async () => {
    if (!center) return alert("Masukkan lokasi terlebih dahulu");
    setIsLoading(true);
    try {
      const nearbyPlaces = await getNearbyPlaces(center[0], center[1]);
      setPlaces(nearbyPlaces);
    } catch {
      alert("Gagal mencari tempat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <Sidebar
        inputName={inputName}
        setInputName={setInputName}
        onGetLocation={handleGetMyLocation}
        onSearch={handleSearch}
        isLoading={isLoading}
        friends={friends}
      />
      <main className="flex-1 relative h-[50vh] md:h-full w-full">
        <Map friends={friends}/>
      </main>
    </div>
  );
}
