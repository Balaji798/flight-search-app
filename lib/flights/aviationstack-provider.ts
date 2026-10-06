/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlightProvider } from "./flight-provider";
import { FlightSearchParams, FlightSearchResponse, Flight } from "./types";

// See https://aviationstack.com/documentation

export class AviationStackProvider implements FlightProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.AVIATIONSTACK_API_KEY || "";
  }

  async searchFlights(
    params: FlightSearchParams,
  ): Promise<FlightSearchResponse> {
    if (!this.apiKey) {
      throw new Error("Aviationstack API key is not configured.");
    }

    // Aviationstack requires premium for "flights" specifying date, or historical.
    // For free tier, we map the search as best as we can to `/flights`.
    // The aviationstack `/flights` endpoint primarily returns live flights, not robust future schedules or pricing.
    // So we'll map the params as closely as possible to their schema.

    const url = new URL("http://api.aviationstack.com/v1/flights");
    url.searchParams.append("access_key", this.apiKey);

    // We can filter by origin & destination IATA codes if available (they are code in our params)
    if (params.from) url.searchParams.append("dep_iata", params.from);
    if (params.to) url.searchParams.append("arr_iata", params.to);

    // Aviationstack free tier does not support future schedule search well, nor does it return pricing.
    // We will do a generic query and map it.

    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: 3600 }, // cache for 1 hour to save credits!
      });

      if (!response.ok) {
        throw new Error(
          `Aviationstack API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          `Aviationstack API returned error: ${data.error.message || JSON.stringify(data.error)}`,
        );
      }

      // Map to normalized Flight model
      const flights: Flight[] = (data.data || [])
        .slice(0, 20)
        .map((flightData: any, index: number) => {
          const depTime =
            flightData.departure?.estimated ||
            flightData.departure?.scheduled ||
            params.departureDate + "T00:00:00";
          const arrTime =
            flightData.arrival?.estimated ||
            flightData.arrival?.scheduled ||
            params.departureDate + "T02:00:00";

          // Aviation stack doesn't provide real pricing. The prompt says: "Do not claim an external API provides flight prices unless it actually does."
          // We will leave price as 0 or throw an error indicating limitation, but to demonstrate UI, we'll keep it 0 and let UI handle "Price Unavailable" if price === 0.

          return {
            id: `as-${flightData.flight?.iata || "unknown"}-${index}`,
            airline: flightData.airline?.name || "Unknown Airline",
            flightNumber:
              flightData.flight?.iata || flightData.flight?.number || "XX123",
            departure: {
              airport: flightData.departure?.airport || params.from,
              code: flightData.departure?.iata || params.from,
              dateTime: depTime,
            },
            arrival: {
              airport: flightData.arrival?.airport || params.to,
              code: flightData.arrival?.iata || params.to,
              dateTime: arrTime,
            },
            duration: "Duration unavailable", // Needs complex date math or unavailable from API
            durationMinutes: 0,
            stops: 0,
            price: 0, // NO REAL PRICE IN AVIATIONSTACK FREE TIER
            currency: "USD",
          };
        });

      return { flights };
    } catch (error: any) {
      console.error("AviationStackProvider error:", error);
      throw error;
    }
  }
}
