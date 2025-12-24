'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SettingsPanel from '@/app/components/SettingsPanel';
import NotificationsPanel from '@/app/components/NotificationsPanel';
import { PanelProvider } from '@/app/contexts/PanelContext';
import Sidebar from '@/app/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <PanelProvider>
            <div className="min-h-screen bg-background">
                <SettingsPanel />
                <NotificationsPanel />
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

                {/* Main Content */}
                <main className={`${!isCollapsed ? 'lg:ml-64' : ''} transition-all duration-300`}>
                    {children}
                </main>
            </div>
        </PanelProvider>
    );
}
