'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/user';
import { usePanelContext } from '../contexts/PanelContext';

export default function SettingsPanel() {
    const { theme, setTheme } = useTheme();
    const { settingsPanelOpen: isOpen, setSettingsPanelOpen: setIsOpen } = usePanelContext();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (error) {
                console.error('Failed to parse user:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <>
            { !isOpen && (
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 right-6 z-50 p-3 rounded-full bg-primary hover:bg-primary-hover text-white shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Settings"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>
            )}

            {/* Settings Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-card-bg border-l border-card-border shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-card-border transition-colors"
                                aria-label="Close settings"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-foreground"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Menu */}
                        <div className="space-y-2 mb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Navigation</h3>

                            <button
                                onClick={() => {
                                    router.push('/dashboard');
                                    setIsOpen(false);
                                }}
                                className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${pathname === '/dashboard'
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-accent/10 text-foreground'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="font-medium">Dashboard</span>
                            </button>

                            {user?.isAdmin && (
                                <button
                                    onClick={() => {
                                        router.push('/admin');
                                        setIsOpen(false);
                                    }}
                                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${pathname?.startsWith('/admin')
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-accent/10 text-foreground'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="font-medium">Admin Panel</span>
                                    <span className="ml-auto text-xs bg-accent/20 px-2 py-1 rounded">Admin</span>
                                </button>
                            )}

                            {user?.email === 'hi@starteaseai.com' && (
                                <>
                                    <button
                                        onClick={() => {
                                            router.push('/superadmin/products/create');
                                            setIsOpen(false);
                                        }}
                                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${pathname === '/superadmin/products/create'
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-accent/10 text-foreground'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="font-medium">Create Product</span>
                                        <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Super</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            router.push('/superadmin/documents/create');
                                            setIsOpen(false);
                                        }}
                                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${pathname === '/superadmin/documents/create'
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-accent/10 text-foreground'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="font-medium">Create Document</span>
                                        <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Super</span>
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>

                        {/* Theme Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>

                            {/* Cool Dark Bluish Theme */}
                            <button
                                onClick={() => setTheme('dark')}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${theme === 'dark'
                                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                                    : 'border-card-border hover:border-primary/50 hover:scale-102'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">Cool Dark</div>
                                        <div className="text-sm text-muted">Deep blues with vibrant accents</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[#0a0e1a] border border-card-border"></div>
                                    </div>
                                </div>
                            </button>

                            {/* Quiet Light Theme */}
                            <button
                                onClick={() => setTheme('light')}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${theme === 'light'
                                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                                    : 'border-card-border hover:border-primary/50 hover:scale-102'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="font-semibold text-foreground">Quiet Light</div>
                                        <div className="text-sm text-muted">Soft whites with subtle accents</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[#fafbfc] border border-gray-300"></div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Current Theme Info */}
                        <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/30">
                            <div className="text-sm text-muted mb-1">Current Theme</div>
                            <div className="font-semibold text-foreground">
                                {theme === 'dark' ? 'Cool Dark Bluish' : 'Quiet Light'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
