export interface Friend {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAdmin?: boolean;
}

export interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
}