"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

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
  return (
    <main className="p-8 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">tengahan</h1>
      <div className="w-full h-125">
        <Map />
      </div>
    </main>
  );
}
