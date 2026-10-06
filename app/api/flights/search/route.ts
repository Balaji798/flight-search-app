import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FlightSearchParams } from "@/lib/flights/types";
import { MockFlightProvider } from "@/lib/flights/mock-provider";
import { AviationStackProvider } from "@/lib/flights/aviationstack-provider";

// Zod schema to validate incoming search parameters
const searchSchema = z.object({
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  returnDate: z.string().optional(),
  adults: z.coerce.number().min(1).max(9),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
  tripType: z.enum(["one-way", "round-trip"]),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      departureDate: searchParams.get("departureDate"),
      returnDate: searchParams.get("returnDate") || undefined,
      adults: searchParams.get("adults"),
      cabinClass: searchParams.get("cabinClass"),
      tripType: searchParams.get("tripType"),
    };

    const validatedData = searchSchema.parse(params) as FlightSearchParams;

    if (validatedData.from === validatedData.to) {
      return NextResponse.json(
        { error: "Origin and destination cannot be identical." },
        { status: 400 },
      );
    }

    if (validatedData.tripType === "round-trip" && validatedData.returnDate) {
      if (
        new Date(validatedData.returnDate) <
        new Date(validatedData.departureDate)
      ) {
        return NextResponse.json(
          { error: "Return date cannot be before departure date." },
          { status: 400 },
        );
      }
    }

    // Select provider based on env var
    const providerType = process.env.FLIGHT_PROVIDER || "mock";
    let provider;

    if (providerType === "aviationstack") {
      provider = new AviationStackProvider();
    } else {
      provider = new MockFlightProvider();
    }

    const results = await provider.searchFlights(validatedData);

    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Log real error on server, respond with friendly message
    console.error("Flight Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flights. Please try again later." },
      { status: 500 },
    );
  }
}
