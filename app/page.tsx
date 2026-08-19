"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useEffect } from "react";

export interface Friend {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAdmin?: boolean;
}

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

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newFriend: Friend = {
          id: crypto.randomUUID(),
          name: inputName || "Saya (Admin)",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isAdmin: true,
        };

        setFriends((prevFriends) => [...prevFriends, newFriend]);
        setInputName("");
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  useEffect(() => {
    handleGetMyLocation();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <aside className="w-full md:w-96 bg-white p-6 z-10 flex flex-col border-b md:border-r border-gray-200 overflow-y-auto max-h-[50vh] md:max-h-full">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">tengahan</h1>
        <div className="space-y-4">
          {/* input form */}
          <h2>halo</h2>
        </div>
      </aside>
      <main className="flex-1 relative h-[50vh] md:h-full w-full">
        <Map friends={friends}/>
      </main>
    </div>
  );
}
