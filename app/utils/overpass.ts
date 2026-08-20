import { Place } from "../types/index";

export const getNearbyPlaces = async (lat: number, lng: number): Promise<Place[]> => {
    const radius = 1000;
    const query = `
        [out:json];
        (
          node["amenity"="cafe"](around:${radius},${lat},${lng});
          node["amenity"="restaurant"](around:${radius},${lat},${lng});
        );
        out body;
    `;
    
    
    const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data.elements.map((item: any) => ({
        id: item.id,
        name: item.tags.name || "Unknown",
        lat: item.lat,
        lng: item.lon,
        category: item.tags.amenity || "Unknown"
    }));
};