"use client";
import { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Friend, Place } from "./types/index";
import { calculateCentroid } from "./utils/centroid";
import { getNearbyPlaces } from "./utils/places";
import { getRegionName } from "./utils/reverseGeocode";
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
  const [category, setCategory] = useState<string[]>(["Meal"]);
  const [anyInput, setAnyInput] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [regionName, setRegionName] = useState<string>("");

  const center = calculateCentroid(friends) || [0, 0];
  console.log(center);

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

  const handleAddFriend = (name: string, lat: number, lng: number) => {
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name: name,
      lat: lat,
      lng: lng,
      isAdmin: false,
    };
    setFriends((prev) => [...prev, newFriend]);
  };

  const handleSearch = async () => {
    if (!center) return alert("Masukkan lokasi terlebih dahulu");
    setIsLoading(true);
    try {
      const nearbyPlaces = await getNearbyPlaces(category[0], anyInput, center[0], center[1]);
      const regionName = await getRegionName(center[0], center[1]);
      setRegionName(regionName);
      setPlaces(nearbyPlaces);
    } catch (error) {
      console.error("getNearbyPlaces failed:", error);
      alert("Gagal mencari tempat");
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <Sidebar
        inputName={inputName}
        setInputName={setInputName}
        onGetLocation={handleGetMyLocation}
        onSearch={handleSearch}
        onAddFriend={handleAddFriend}
        isLoading={isLoading}
        friends={friends}
        category={category}
        setCategory={setCategory}
        anyInput={anyInput}
        setAnyInput={setAnyInput}
      />
      <main className="flex-1 relative h-[50vh] md:h-full w-full">
        <Map friends={friends}/>
      </main>
    </div>
  );
}
