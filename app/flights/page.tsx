/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Flight } from '@/lib/flights/types';
import { FlightCard } from '@/components/results/FlightCard';
import { Loader2, ArrowLeft, Filter, Navigation, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

function FlightResultsInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Extract params to show in header
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const departureDate = searchParams.get('departureDate');
    const adults = searchParams.get('adults');

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError('');
            try {
                const query = searchParams.toString();
                const res = await fetch(`/api/flights/search?${query}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to fetch flights');
                }
                const data = await res.json();
                setFlights(data.flights || []);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (from && to && departureDate) {
            fetchFlights();
        } else {
            setLoading(false);
            setError('Invalid search parameters. Please try searching again.');
        }
    }, [searchParams, from, to, departureDate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header Summary */}
            <div className="bg-brand-900 text-white shadow-md relative z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center font-bold text-lg">
                                {from} <Navigation className="w-4 h-4 mx-2 rotate-90 text-brand-300" /> {to}
                            </div>
                            <div className="text-brand-200 text-sm flex gap-3">
                                <span>{departureDate}</span>
                                <span>•</span>
                                <span>{adults} Traveller{Number(adults) > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="border-brand-500/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm shadow-sm" onClick={() => router.push('/')}>
                        Modify Search
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

                {/* Filters Sidebar (Mocked conceptually) */}
                <div className="w-full md:w-64 shrink-0 space-y-6 hidden md:block">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Filters</h3>
                            <Filter className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold mb-2">Stops</p>
                                <label className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input type="checkbox" className="rounded text-brand-600" defaultChecked />
                                    <span>Non-stop</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 mt-2">
                                    <input type="checkbox" className="rounded text-brand-600" defaultChecked />
                                    <span>1 Stop</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flight List */}
                <div className="flex-1 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
                            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Searching best routes...</h3>
                            <p className="text-slate-500">Comparing hundreds of airlines for you.</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
                            <p className="text-red-700 dark:text-red-400 font-semibold mb-4">{error}</p>
                            <Button onClick={() => router.push('/')} variant="outline" className="border-red-200 hover:bg-red-100">
                                Go back to search
                            </Button>
                        </div>
                    ) : flights.length === 0 ? (
                        <div className="p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                                <Plane className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No flights found</h3>
                            <p className="text-slate-500 mb-6">We could not find any flights matching your criteria.</p>
                            <Button onClick={() => router.push('/')}>Modify Search</Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-600 dark:text-slate-400 font-medium">
                                    Showing <span className="font-bold text-slate-900 dark:text-white">{flights.length}</span> flights
                                </p>
                            </div>

                            <div className="space-y-4">
                                {flights.map((flight) => (
                                    <FlightCard key={flight.id} flight={flight} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function FlightsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>}>
            <FlightResultsInner />
        </Suspense>
    );
}
