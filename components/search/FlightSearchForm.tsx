"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TripType, CabinClass } from '@/lib/flights/types';
import { Plane, Calendar, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AirportInput } from '@/components/search/AirportInput';

export function FlightSearchForm() {
    const router = useRouter();

    const [tripType, setTripType] = useState<TripType>('one-way');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [adults, setAdults] = useState('1');
    const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!from || !to) {
            setError('Please select both origin and destination.');
            return;
        }
        if (from.toLowerCase() === to.toLowerCase()) {
            setError('Origin and destination cannot be identical.');
            return;
        }
        if (!departureDate) {
            setError('Please select a departure date.');
            return;
        }
        if (tripType === 'round-trip' && !returnDate) {
            setError('Please select a return date.');
            return;
        }
        if (tripType === 'round-trip' && new Date(returnDate) < new Date(departureDate)) {
            setError('Return date cannot be before departure date.');
            return;
        }

        // Build URL Parameters
        const params = new URLSearchParams();
        params.set('from', from.toUpperCase());
        params.set('to', to.toUpperCase());
        params.set('departureDate', departureDate);
        if (tripType === 'round-trip') {
            params.set('returnDate', returnDate);
        }
        params.set('adults', adults);
        params.set('cabinClass', cabinClass);
        params.set('tripType', tripType);

        router.push(`/flights?${params.toString()}`);
    };

    const swapAirports = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <Card className="w-full max-w-5xl mx-auto shadow-xl glass-panel relative overflow-visible border-0 mt-8">
            <div className="absolute -top-5 left-8 flex space-x-1 bg-white dark:bg-slate-900 rounded-t-lg px-2 pt-2 shadow-sm">
                <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={cn("px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors", tripType === 'one-way' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800')}
                >
                    One Way
                </button>
                <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={cn("px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors", tripType === 'round-trip' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800')}
                >
                    Round Trip
                </button>
            </div>

            <CardContent className="pt-8">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

                        {/* Origin & Destination Group */}
                        <div className="lg:col-span-5 flex relative">
                            <div className="w-1/2 relative group">
                                <AirportInput
                                    label="From"
                                    placeholder="Origin (e.g. DEL)"
                                    value={from}
                                    onChange={setFrom}
                                    inputClassName="rounded-r-none border-r-0"
                                />
                            </div>

                            {/* Swap Button */}
                            <button
                                type="button"
                                onClick={swapAirports}
                                className="absolute left-1/2 top-[28px] -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-brand-600 hover:bg-brand-50 z-20 transition-transform active:scale-95"
                            >
                                <ArrowRightLeft className="h-4 w-4" />
                            </button>

                            <div className="w-1/2 relative">
                                <AirportInput
                                    label="To"
                                    placeholder="Destination (e.g. BOM)"
                                    value={to}
                                    onChange={setTo}
                                    inputClassName="rounded-l-none"
                                />
                            </div>
                        </div>

                        {/* Dates Group */}
                        <div className="lg:col-span-4 flex">
                            <div className="w-1/2 relative">
                                <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Departure</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        type="date"
                                        className={`pl-9 h-14 font-medium focus-visible:ring-0 focus-visible:border-brand-500 relative z-10 ${tripType === 'round-trip' ? 'rounded-r-none border-r-0' : ''}`}
                                        value={departureDate}
                                        onChange={(e) => setDepartureDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {tripType === 'round-trip' && (
                                <div className="w-1/2 relative">
                                    <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Return</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <Input
                                            type="date"
                                            className="pl-9 h-14 rounded-l-none font-medium focus-visible:ring-0 focus-visible:border-brand-500 relative z-10"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={departureDate}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Travelers & Cabin */}
                        <div className={`lg:col-span-3 flex gap-2 ${tripType === 'one-way' ? 'lg:col-span-3' : ''}`}>
                            <div className="w-1/3">
                                <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Guests</label>
                                <select
                                    className="flex h-14 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-brand-500 dark:border-slate-700 dark:bg-slate-950 font-medium"
                                    value={adults}
                                    onChange={(e) => setAdults(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-2/3">
                                <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Class</label>
                                <select
                                    className="flex h-14 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-brand-500 dark:border-slate-700 dark:bg-slate-950 font-medium"
                                    value={cabinClass}
                                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                                >
                                    <option value="economy">Economy</option>
                                    <option value="premium_economy">Premium Economy</option>
                                    <option value="business">Business</option>
                                    <option value="first">First</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col items-center mt-6">
                        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 py-2 px-4 rounded-md">{error}</p>}
                        <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold rounded-full shadow-lg hover:shadow-brand-500/25 group">
                            <Plane className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            Search Flights
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
