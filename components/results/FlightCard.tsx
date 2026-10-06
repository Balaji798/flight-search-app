import React from 'react';
import { Flight } from '@/lib/flights/types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plane, Luggage, Clock, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function FlightCard({ flight }: { flight: Flight }) {
    // Parsing date assuming it's an ISO string or valid date string like 2026-10-15T18:00:00
    let depTime = null;
    let arrTime = null;

    try {
        depTime = format(new Date(flight.departure.dateTime), 'HH:mm');
        arrTime = format(new Date(flight.arrival.dateTime), 'HH:mm');
    } catch (e) {
        depTime = '--:--';
        arrTime = '--:--';
    }

    // Format price
    const formattedPrice = flight.price > 0
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: flight.currency, maximumFractionDigits: 0 }).format(flight.price)
        : 'Price Unavailable';

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800 overflow-hidden group">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">

                    <div className="flex-1 p-6 flex flex-col justify-center">
                        {/* Airline Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                                    {flight.airlineLogo ? (
                                        <img src={flight.airlineLogo} alt={flight.airline} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        flight.airline.slice(0, 2)
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{flight.airline}</p>
                                    <p className="text-xs text-slate-500">{flight.flightNumber}</p>
                                </div>
                            </div>

                            <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md inline-flex items-center">
                                <Check className="w-3 h-3 mr-1" />
                                Available
                            </div>
                        </div>

                        {/* Timings and Stops */}
                        <div className="flex items-center justify-between">

                            <div className="text-center md:text-left">
                                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{depTime}</p>
                                <p className="text-sm font-medium text-slate-500">{flight.departure.code}</p>
                            </div>

                            <div className="flex-1 px-4 flex flex-col items-center">
                                <p className="text-xs font-semibold text-slate-500 mb-1">{flight.duration}</p>
                                <div className="w-full flex items-center">
                                    <div className="h-px bg-slate-300 flex-1 relative"></div>
                                    <Plane className="w-4 h-4 mx-2 text-brand-500" />
                                    <div className="h-px bg-slate-300 flex-1 relative"></div>
                                </div>
                                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">
                                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                                </p>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{arrTime}</p>
                                <p className="text-sm font-medium text-slate-500">{flight.arrival.code}</p>
                            </div>

                        </div>
                    </div>

                    <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center items-center md:items-end relative">
                        <div className="w-full flex justify-between md:flex-col md:items-end mb-4">
                            {flight.baggage && (
                                <div className="inline-flex items-center text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 md:mb-2 shadow-sm">
                                    <Luggage className="w-3 h-3 mr-1 text-slate-400" />
                                    {flight.baggage}
                                </div>
                            )}

                            <div className="text-right">
                                <p className="text-xs text-slate-500 font-medium uppercase mb-0.5">Per Adult</p>
                                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 leading-none">
                                    {formattedPrice}
                                </p>
                            </div>
                        </div>

                        <Button className="w-full shadow-md hover:shadow-lg transition-transform active:scale-95 group">
                            Select Flight
                            <Plane className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
