import { FlightProvider } from "./flight-provider";
import { FlightSearchParams, FlightSearchResponse, Flight } from "./types";

// Utility to generate a deterministic list of flights based on from/to
export class MockFlightProvider implements FlightProvider {
  async searchFlights(
    params: FlightSearchParams,
  ): Promise<FlightSearchResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { from, to, departureDate, adults, cabinClass } = params;

    // Base mock flights
    const baseFlights: Flight[] = [
      {
        id: "FL-001",
        airline: "IndiGo",
        flightNumber: "6E-101",
        departure: {
          airport: from,
          code: from,
          dateTime: `${departureDate}T06:00:00`,
        },
        arrival: {
          airport: to,
          code: to,
          dateTime: `${departureDate}T08:15:00`,
        },
        duration: "2h 15m",
        durationMinutes: 135,
        stops: 0,
        price: 4500,
        currency: "INR",
        baggage: "15kg Cabin",
      },
      {
        id: "FL-002",
        airline: "Air India",
        flightNumber: "AI-204",
        departure: {
          airport: from,
          code: from,
          dateTime: `${departureDate}T09:30:00`,
        },
        arrival: {
          airport: to,
          code: to,
          dateTime: `${departureDate}T12:00:00`,
        },
        duration: "2h 30m",
        durationMinutes: 150,
        stops: 0,
        price: 5200,
        currency: "INR",
        baggage: "25kg Check-in",
      },
      {
        id: "FL-003",
        airline: "Vistara",
        flightNumber: "UK-811",
        departure: {
          airport: from,
          code: from,
          dateTime: `${departureDate}T14:45:00`,
        },
        arrival: {
          airport: to,
          code: to,
          dateTime: `${departureDate}T19:30:00`,
        },
        duration: "4h 45m",
        durationMinutes: 285,
        stops: 1,
        price: 4100,
        currency: "INR",
        baggage: "15kg Check-in",
      },
      {
        id: "FL-004",
        airline: "SpiceJet",
        flightNumber: "SG-405",
        departure: {
          airport: from,
          code: from,
          dateTime: `${departureDate}T18:00:00`,
        },
        arrival: {
          airport: to,
          code: to,
          dateTime: `${departureDate}T20:20:00`,
        },
        duration: "2h 20m",
        durationMinutes: 140,
        stops: 0,
        price: 3900,
        currency: "INR",
        baggage: "7kg Cabin",
      },
      {
        id: "FL-005",
        airline: "Akasa Air",
        flightNumber: "QP-701",
        departure: {
          airport: from,
          code: from,
          dateTime: `${departureDate}T21:10:00`,
        },
        arrival: {
          airport: to,
          code: to,
          dateTime: `${departureDate}T23:30:00`,
        },
        duration: "2h 20m",
        durationMinutes: 140,
        stops: 0,
        price: 3700,
        currency: "INR",
      },
    ];

    // Adjust prices based on cabin class and adults
    let multiplier = 1;
    if (cabinClass === "premium_economy") multiplier = 1.8;
    if (cabinClass === "business") multiplier = 3.5;
    if (cabinClass === "first") multiplier = 5.0;

    const scaledFlights = baseFlights.map((f) => ({
      ...f,
      price: Math.round(f.price * multiplier * adults),
    }));

    return { flights: scaledFlights };
  }
}
