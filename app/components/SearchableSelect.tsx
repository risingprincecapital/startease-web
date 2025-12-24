'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    required,
    className = '',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Filter options based on search
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearch('');
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

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearch('');
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
            >
                <span className={selectedOption ? 'text-foreground' : 'text-muted'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-lg shadow-xl max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-border sticky top-0 bg-surface">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type to search..."
                            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-64">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-accent/10 transition-colors ${option.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-muted text-center">
                                No options found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden input for form validation */}
            {required && (
                <input
                    type="text"
                    value={value}
                    onChange={() => { }}
                    required
                    className="absolute opacity-0 pointer-events-none"
                    tabIndex={-1}
                />
            )}
        </div>
    );
}
