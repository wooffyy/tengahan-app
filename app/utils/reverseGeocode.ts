export const getRegionName = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Reverse Geocode API error: ${response.status}`, errorBody);
            return "sekitar sini";
        }

        const data = await response.json();
        if (!data.features || data.features.length === 0) {
            return "sekitar sini";
        }

        const props = data.features[0].properties;
        // pick the most specific available name — village is more useful than city
        return props.village || props.suburb || props.district || props.city || props.street || "sekitar sini";
    } catch (error) {
        console.error("Reverse Geocode fetch failed:", error);
        return "sekitar sini";
    }
};