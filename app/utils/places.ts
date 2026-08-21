import { Place } from "../types/index";
import { buildPlacesQuery, buildAutocompleteQuery } from "./poiCategories";

export const getNearbyPlaces = async (
    category: string,
    anyInput: string,
    lat: number,
    lng: number
): Promise<Place[]> => {
    if (category === "Any") {
        return getAutocompletePlaces(anyInput, lat, lng);
    }
    return getCategorizedPlaces(category, lat, lng);
};

const RADIUS_STEPS = [2000, 5000, 8000]; 

const getCategorizedPlaces = async (category: string, lat: number, lng: number): Promise<Place[]> => {
  const query = buildPlacesQuery(category, lat, lng);
  const response = await fetch(`/api/places?${query}`);

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
      name: props.name || props.address_line1 || "Unknown",
      lat,
      lng,
      category: props.categories?.find((c: string) => c.startsWith("catering.")) || props.categories?.[0] || "Unknown",
    };
  });
};


const getAutocompletePlaces = async (anyInput: string, lat: number, lng: number): Promise<Place[]> => {
  if (!anyInput || anyInput.trim().length < 2) return [];

  for (const radius of RADIUS_STEPS) {
    const query = buildAutocompleteQuery(anyInput, lat, lng, radius);
    const response = await fetch(`/api/any-places?${query}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Autocomplete API error: ${response.status}`, errorBody);
      throw new Error(`Autocomplete request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features.map((feature: any) => {
        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;
        return {
          id: props.place_id,
          name: props.name || props.address_line1 || "Unknown",
          lat,
          lng,
          category: props.category || "Unknown",
        };
      });
    }
  }
  return [];
};