'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SettingsPanel from '@/app/components/SettingsPanel';
import { User } from '@/types/user';
import { useToast } from '@/app/contexts/ToastContext';

interface Business {
    _id: string;
    businessName: string;
    entityType: string;
    compLocation: string;
    isActive: boolean;
    createdAt: string;
    userId: {
        _id: string;
        email: string;
        name?: string;
    };
}

export default function AdminDashboard() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        // Check if user is admin
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);

            if (!userData.isAdmin) {
                router.push('/dashboard');
                return;
            }
        } else {
            router.push('/login');
            return;
        }

        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBusinesses(data.businesses || []);
            } else if (response.status === 403) {
                showToast('Access denied. Admin privileges required.', 'error');
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                throw new Error('Failed to fetch businesses');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to load businesses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        fetchBusinesses();
    };

    // Group businesses by user
    const businessesByUser = businesses.reduce((acc: any, business) => {
        const userEmail = business.userId.email;
        if (!acc[userEmail]) {
            acc[userEmail] = {
                user: business.userId,
                businesses: []
            };
        }
        acc[userEmail].businesses.push(business);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <SettingsPanel />
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-surface rounded w-1/3"></div>
                        <div className="h-64 bg-surface rounded"></div>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-background p-8">
            <SettingsPanel />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-muted">Manage all businesses and users</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by business name or user email..."
                            className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <div className="text-muted text-sm mb-1">Total Businesses</div>
                        <div className="text-3xl font-bold text-foreground">{businesses.length}</div>
                    </div>
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <div className="text-muted text-sm mb-1">Total Users</div>
                        <div className="text-3xl font-bold text-foreground">{Object.keys(businessesByUser).length}</div>
                    </div>
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <div className="text-muted text-sm mb-1">Active Businesses</div>
                        <div className="text-3xl font-bold text-foreground">
                            {businesses.filter(b => b.isActive).length}
                        </div>
                    </div>
                </div>

                {/* Businesses by User */}
                <div className="space-y-6">
                    {Object.values(businessesByUser).map((group: any) => (
                        <div key={group.user._id} className="bg-surface border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{group.user.email}</h3>
                                    {group.user.name && (
                                        <p className="text-sm text-muted">{group.user.name}</p>
                                    )}
                                </div>
                                <span className="text-sm text-muted">
                                    {group.businesses.length} {group.businesses.length === 1 ? 'business' : 'businesses'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.businesses.map((business: Business) => (
                                    <button
                                        key={business._id}
                                        onClick={() => router.push(`/admin/businesses/${business._id}`)}
                                        className="bg-background border border-border rounded-lg p-4 text-left hover:border-primary transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-foreground">{business.businessName}</h4>
                                            <span className={`text-xs px-2 py-1 rounded ${business.isActive
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-yellow-500/10 text-yellow-600'
                                                }`}>
                                                {business.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted space-y-1">
                                            <p>{business.entityType}</p>
                                            <p>{business.compLocation}</p>
                                            <p className="text-xs">
                                                Created: {new Date(business.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {businesses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted">No businesses found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
