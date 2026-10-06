// Normalized domain models for flight search

export type TripType = "one-way" | "round-trip";
export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export interface Airport {
  code: string; // e.g. DEL
  name: string; // e.g. Indira Gandhi International Airport
  city: string; // e.g. New Delhi
  country: string; // e.g. India
}

export interface FlightSearchParams {
  from: string; // Airport code
  to: string; // Airport code
  departureDate: string; // YYYY-MM-DD format
  returnDate?: string; // YYYY-MM-DD format
  adults: number;
  cabinClass: CabinClass;
  tripType: TripType;
}

export interface FlightSegment {
  airport: string; // Airport name or city
  code: string; // Airport code
  dateTime: string; // ISO String or formatted string
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  airlineLogo?: string; // URL to logo or initial
  departure: FlightSegment;
  arrival: FlightSegment;
  duration: string; // e.g. "2h 15m"
  durationMinutes: number; // For sorting
  stops: number;
  price: number;
  currency: string;
  baggage?: string;
}

export interface FlightSearchResponse {
  flights: Flight[];
  // If round trip, we might want to return outbound and return flights separately
  // But for simplicity in this model, we can treat them as two searches or distinct sets
  // Or handle it as one list of combined itineraries.
  // We'll keep it simple: just flights that match the criteria.
}
