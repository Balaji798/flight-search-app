import { FlightSearchParams, FlightSearchResponse } from "./types";

export interface FlightProvider {
  /**
   * Search for flights based on the given parameters.
   */
  searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse>;
}
