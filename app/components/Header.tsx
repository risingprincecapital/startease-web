'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/logo.jpg"
                            alt="StartEase Agent logo"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-lg"
                        />
                        <span className="font-bold text-xl text-foreground">StartEase</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-surface transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <svg
                                    className="h-5 w-5 text-muted"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5 text-muted"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Auth Controls */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/dashboard"
                                    className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="hidden md:block text-sm font-medium text-muted hover:text-foreground transition-colors"
                                >
                                    Logout
                                </button>
                                {user?.profileImage && (
                                    <Image
                                        src={user.profileImage}
                                        alt={user.name || 'User'}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full border border-border"
                                    />
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Login
                            </Link>
                        )}

                        {/* Menu Button (Mobile) */}
                        <button className="p-2 rounded-full hover:bg-surface transition-colors md:hidden">
                            <svg
                                className="h-5 w-5 text-muted"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
