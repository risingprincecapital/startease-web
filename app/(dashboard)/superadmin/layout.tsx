'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // useEffect(() => {
    //     if (!loading && (!user || !user.isSuperAdmin)) {
    //         router.push('/login');
    //     }
    // }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // if (!user || !user.isSuperAdmin) {
    //     return null;
    // }

    const navigation = [
        { name: 'Dashboard', href: '/superadmin', icon: 'HomeIcon' },
        { name: 'Create Product', href: '/superadmin/products/create', icon: 'PlusIcon' },
        { name: 'Create Document', href: '/superadmin/documents/create', icon: 'DocumentIcon' },
    ];

    return (
        <div className="bg-background lg:ml-20 flex mt-8">
            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-in-out ml-20}`}>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
