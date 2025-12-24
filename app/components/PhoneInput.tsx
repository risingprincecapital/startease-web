'use client';

import { useState, useRef, useEffect } from 'react';
import { COUNTRY_CODES } from '@/lib/constants';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
}

export default function PhoneInput({ value, onChange, required, className = '' }: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Parse the current value to extract country code and number
    const parsePhone = (phoneStr: string) => {
        if (!phoneStr) return { dialCode: '+1', number: '' };

        // Match country code (+ followed by 1-4 digits) at the start
        const match = phoneStr.match(/^(\+\d{1,4})(.*)$/);
        if (match) {
            return { dialCode: match[1], number: match[2] };
        }
        return { dialCode: '+1', number: phoneStr };
    };

    const { dialCode, number } = parsePhone(value);
    const selectedCountry = COUNTRY_CODES.find(c => c.dialCode === dialCode) || COUNTRY_CODES[0];

    // Filter countries based on search
    const filteredCountries = COUNTRY_CODES.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dialCode.includes(search) ||
        country.code.toLowerCase().includes(search.toLowerCase())
    );

    // Sort: popular first, then alphabetically
    const sortedCountries = [...filteredCountries].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
    });

    const handleCountrySelect = (country: typeof COUNTRY_CODES[0]) => {
        onChange(`${country.dialCode} ${number}`);
        setIsOpen(false);
        setSearch('');
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value.replace(/[^\d]/g, ''); // Only digits
        onChange(`${dialCode} ${newNumber}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2">
                {/* Country Code Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-3 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2 min-w-[120px]"
                    >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute z-50 mt-1 w-80 bg-surface border border-border rounded-lg shadow-xl max-h-80 overflow-hidden">
                            {/* Search Input */}
                            <div className="p-2 border-b border-border sticky top-0 bg-surface">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search countries..."
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                            </div>

                            {/* Country List */}
                            <div className="overflow-y-auto max-h-64">
                                {sortedCountries.length > 0 ? (
                                    sortedCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-accent/10 transition-colors text-left ${country.dialCode === dialCode ? 'bg-primary/10' : ''
                                                }`}
                                        >
                                            <span className="text-xl">{country.flag}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-foreground truncate">
                                                    {country.name}
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted">{country.dialCode}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-muted text-center">
                                        No countries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={number}
                    onChange={handleNumberChange}
                    placeholder="1234567890"
                    required={required}
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    );
}
