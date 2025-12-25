'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business } from '@/types/business';
import { useToast } from '@/app/contexts/ToastContext';
import { environment } from '@/app/utils/env';

export default function DashboardPage() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/businesses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBusinesses(data.businesses || []);
            }
        } catch (error) {
            console.error('Failed to fetch businesses:', error);
            showToast('Failed to fetch businesses', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-surface rounded w-1/4"></div>
                    <div className="h-32 bg-surface rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Businesses</h1>
                        <p className="mt-2 text-muted">Manage your businesses</p>
                    </div>
                    <button
                        onClick={() => router.push('/businesses/new')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Create New Business
                    </button>
                </div>

                {businesses.length === 0 ? (
                    <div className="bg-surface border border-border rounded-lg p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-muted"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-foreground">No businesses yet</h3>
                        <p className="mt-2 text-muted">Get started by creating your first business</p>
                        <button
                            onClick={() => router.push('/businesses/new')}
                            className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Create Your First Business
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {businesses.map((business) => {
                            const hasProducts = business.isActive;

                            return (
                                <div
                                    key={business._id}
                                    className={`relative rounded-lg p-6 transition-all overflow-hidden ${hasProducts
                                        ? 'bg-surface border border-border hover:border-primary/50 cursor-pointer'
                                        : 'bg-surface border-2 border-destructive shadow-lg shadow-destructive/10'
                                        }`}
                                    onClick={() => hasProducts && router.push(`/businesses/${business._id}`)}
                                >
                                    {/* Alarm Dot for pending payment */}
                                    {!hasProducts && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Content Wrapper - Dimmed if pending */}
                                    <div className={!hasProducts ? 'opacity-75 pointer-events-none select-none' : ''}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{business.businessName}</h3>
                                                <p className="text-sm text-muted mt-1">{business.entityType}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${business.isActive ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted'
                                                    }`}
                                            >
                                                {business.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm text-muted line-clamp-2">{business.businessDescription}</p>
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="text-xs text-muted">{business.compLocation}</p>
                                        </div>
                                    </div>

                                    {/* Payment Pending Overlay & Button */}
                                    {!hasProducts && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/businesses/${business._id}/checkout`);
                                                }}
                                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                Payment Pending
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
