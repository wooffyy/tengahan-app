import { Friend } from "../types/index";

export const calculateCentroid = (friendsList: Friend[]): [number, number] | null => {
    if (friendsList.length === 0) return null;
    
    const totalLat = friendsList.reduce((acc, curr) => acc + curr.lat, 0);
    const totalLng = friendsList.reduce((acc, curr) => acc + curr.lng, 0);
    
    const centroidLat = totalLat / friendsList.length;
    const centroidLng = totalLng / friendsList.length;
    
    return [centroidLat, centroidLng];
}