export interface LocResult {
    displayName: string;
    lat: number;
    lng: number;
}

export const searchAddress = async (query: string): Promise<LocResult[]> => {
    if (!query || query.length < 3) return [];

    const response = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
        throw new Error("Gagal mencari lokasi");
    }

    const data = await response.json();

    if (!data.features) return [];

    return data.features.map((feature: any) => {
        const props = feature.properties;
        const [lng, lat] = feature.geometry.coordinates; 

        const parts = [
            props.name,
            props.street,
            props.district,
            props.city,
            props.state,
            props.country,
        ].filter(Boolean);

        const displayName = [...new Set(parts)].join(", ");

        return {
            displayName,
            lat,
            lng,
        };
    });
};