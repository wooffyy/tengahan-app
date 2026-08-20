import { Place } from "../types/index";

export const getNearbyPlaces = async (lat: number, lng: number): Promise<Place[]> => {
    const response = await fetch(
        `/api/places?lat=${lat}&lng=${lng}`
    );

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Places API error: ${response.status}`, errorBody);
        throw new Error(`Places request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features) return [];

    return data.features.map((feature: any) => {
        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        return {
            id: props.place_id,
            name: props.name || "Unknown",
            lat,
            lng,
            category: props.categories?.[0] || "Unknown",
        };
    });
};