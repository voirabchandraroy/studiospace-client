export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Art Workshop";

export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  provider?: "credentials" | "google";
}

export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  ownerEmail: string;
  ownerName: string;
  createdAt?: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  location: string;
  hourlyRate: number;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalCost: number;
  note?: string;
  status: BookingStatus;
  createdAt?: string;
}

export const STUDIO_CATEGORIES: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

export const AMENITY_OPTIONS = [
  "Cyc Wall",
  "Green Screen",
  "Profoto Lighting",
  "4K Video",
  "Soundproofing",
  "Podcast Microphones",
  "Mixing Console",
  "MIDI Keyboards",
  "Makeup Room",
  "Green Room",
  "Free Parking",
  "Wi-Fi",
  "Kitchenette",
  "Loading Dock",
  "Air Conditioning",
  "Equipment Rental",
];
