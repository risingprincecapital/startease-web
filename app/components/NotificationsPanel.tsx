'use client';

import { useEffect, useState } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter } from 'next/navigation';
import { usePanelContext } from '../contexts/PanelContext';
import { useToast } from '@/app/contexts/ToastContext';

interface Notification {
    _id: string;
    type: string;
    category: string;
    title: string;
    message: string;
    status: string;
    createdAt: string;
    data?: any;
}

export default function NotificationsPanel() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { notificationsPanelOpen: isOpen, setNotificationsPanelOpen: setIsOpen } = usePanelContext();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const { showToast } = useToast();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/notifications?limit=20`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            showToast('Failed to fetch notifications', 'error');
        } finally {
            setLoading(false);
        }
    };

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

        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 3600000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${environment.API_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            showToast('Failed to mark notification as read', 'error');
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${environment.API_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            showToast('Failed to mark all as read', 'error');
        }
    };

    const clearAll = async () => {
        if (!confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await fetch(`${environment.API_URL}/notifications/clear-all`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            showToast('Failed to clear notifications', 'error');
        }
    };

    const getNotificationIcon = (category: string) => {
        switch (category) {
            case 'business':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'payment':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-6 right-24 z-50 p-3 rounded-full bg-surface hover:bg-accent/20 border border-border shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Notifications"
                >
                    <svg
                        className="h-6 w-6 text-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Notifications Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-card-bg border-l border-card-border shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-card-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-card-border transition-colors"
                                aria-label="Close notifications"
                            >
                                <svg
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
                        {(unreadCount > 0 || notifications.length > 0) && (
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-primary hover:text-primary-hover font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-muted">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-card-border">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => {
                                            if (notification.status !== 'read') {
                                                markAsRead(notification._id);
                                            }
                                            // Navigate to business if businessId exists in data
                                            if (notification.data?.businessId) {
                                                // Check if user is admin
                                                const isAdmin = user?.isAdmin || user?.email?.endsWith('@startease.com');
                                                if (isAdmin) {
                                                    router.push(`/admin/businesses/${notification.data.businessId}`);
                                                } else {
                                                    router.push(`/businesses/${notification.data.businessId}`);
                                                }
                                                setIsOpen(false);
                                            } else if (notification.category === 'business' || notification.category === 'document') {
                                                // Fallback to dashboard if no specific business ID
                                                router.push('/dashboard');
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`p-4 cursor-pointer transition-colors ${notification.status === 'read'
                                            ? 'bg-card-bg hover:bg-accent/5'
                                            : 'bg-primary/5 hover:bg-primary/10'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`flex-shrink-0 ${notification.status === 'read' ? 'text-muted' : 'text-primary'
                                                }`}>
                                                {getNotificationIcon(notification.category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-foreground text-sm">
                                                        {notification.title}
                                                    </h3>
                                                    {notification.status !== 'read' && (
                                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted mt-2">
                                                    {getTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
