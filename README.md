# SkyBound - Flight Search Application

SkyBound is a premium, production-quality flight search web application inspired by modern travel booking websites. Built as a demonstration of frontend engineering judgment, clean architecture, and responsive design.

## Features

- **Modern Flight Search Interface**: Beautiful glassmorphism, fluid animations, and professional typography.
- **Airport Autocomplete**: Intelligent origin and destination inputs with common global/Indian airports pre-configured.
- **Flight Results Display**: Clean cards showcasing departure/arrival times, durations, stops, prices, and baggage.
- **Server API Abstraction**: UI fetches from a secure `/api/flights/search` endpoint instead of directly calling external APIs.
- **Mock & Real Providers**: Switch seamlessly between realistic mock data (for reliable demos) and the actual AviationStack API.
- **Robust Error Handling & Validation**: Complete URL state synchronization and thorough form validation using Zod.

## Tech Stack

- **Framework**: Next.js (App Router, Server API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (icons)
- **Validation**: Zod
- **Utilities**: clsx, tailwind-merge, date-fns

## Architecture

The application abstracts flight data fetching via a `FlightProvider` interface. The `/api/flights/search` route receives validated search parameters, queries the selected provider, normalizes data into a canonical `Flight` model, and returns it to the client safely without exposing API keys.

```text
lib/flights/
  ├── types.ts                   // Normalized models
  ├── flight-provider.ts         // Provider Interface
  ├── mock-provider.ts           // Reliable offline mock
  └── aviationstack-provider.ts  // Real API implementation
```

## Environment Variables

Create a `.env.local` file in the root based on `.env.example`:

```env
# Use 'mock' for local development/demos, or 'aviationstack' for real data
FLIGHT_PROVIDER=mock

# If using Aviationstack, provide your free API key
AVIATIONSTACK_API_KEY=your_key_here
```

## How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## API Limitations (Aviationstack)

The free tier of the Aviationstack API focuses primarily on real-time flight tracking rather than comprehensive schedule or pricing data. Therefore:

- The Aviationstack integration maps data as closely as possible to the free-tier `/flights` endpoint.
- It does **not** provide flight pricing (price maps to 0).
- For realistic UX testing, it is highly recommended to use `FLIGHT_PROVIDER=mock`.

## Future Improvements

- Pagination logic for API results
- Advanced filtering and sorting implementation on the results page
- Full PNR/Booking flow simulation
- Additional multi-city trip options
