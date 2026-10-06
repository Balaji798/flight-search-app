/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Airport } from '@/lib/flights/types';

// Mock data as per requirements
const commonAirports: Airport[] = [
    { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Int', city: 'Mumbai', country: 'India' },
    { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', country: 'India' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India' },
    { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
    { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
    { code: 'GOI', name: 'Dabolim', city: 'Goa', country: 'India' },
    { code: 'PNQ', name: 'Pune', city: 'Pune', country: 'India' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India' },
];

interface AirportInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    inputClassName?: string;
}

export function AirportInput({ label, placeholder, value, onChange, className, inputClassName }: AirportInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredAirports = commonAirports.filter((airport) => {
        const q = query.toLowerCase();
        return airport.code.toLowerCase().includes(q) || airport.city.toLowerCase().includes(q) || airport.name.toLowerCase().includes(q);
    });

    const handleSelect = (airport: Airport) => {
        onChange(airport.code);
        setQuery(airport.code);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative w-full", className)} ref={wrapperRef}>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">{label}</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-20" />
                <Input
                    placeholder={placeholder}
                    className={cn("pl-9 h-14 font-medium text-lg focus-visible:ring-0 focus-visible:border-brand-500 relative z-10", inputClassName)}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange(e.target.value); // Optimistically update parent with whatever they typed
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && filteredAirports.length > 0 && (
                <div className="absolute top-[80px] left-0 w-full z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl max-h-64 overflow-y-auto">
                    <ul>
                        {filteredAirports.map((airport) => (
                            <li
                                key={airport.code}
                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                                onClick={() => handleSelect(airport)}
                            >
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">{airport.city}</p>
                                    <p className="text-xs text-slate-500">{airport.name}</p>
                                </div>
                                <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold px-2 py-1 rounded text-sm">
                                    {airport.code}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
