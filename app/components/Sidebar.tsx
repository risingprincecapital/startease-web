import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon', show: true },
        { name: 'Admin Panel', href: '/admin', icon: 'ShieldIcon', show: user?.isAdmin, badge: 'Admin' },
        { name: 'Products', href: '/superadmin/products', icon: 'BoxIcon', show: user?.email === 'hi@starteaseai.com', badge: 'Super' },
        { name: 'Documents', href: '/superadmin/documents', icon: 'DocumentIcon', show: user?.email === 'hi@starteaseai.com', badge: 'Super' },
    ];

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'HomeIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
            case 'ShieldIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
            case 'BoxIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />;
            case 'DocumentIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />;
            default:
                return null;
        }
    };

    return (
        <aside
            className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-surface border-r border-border transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-border`}>
                {isCollapsed ? (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="relative w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
                        title="Expand sidebar"
                    >
                        <Image
                            src="/logo.jpg"
                            alt="Startease Logo"
                            fill
                            className="object-cover"
                        />
                    </button>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src="/logo.jpg"
                                    alt="Startease Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-primary truncate">StartEase</span>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted transition-colors"
                            title="Collapse sidebar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                {navigation.filter(item => item.show).map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary text-white'
                                : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
                                }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {renderIcon(item.icon)}
                            </svg>
                            {!isCollapsed && (
                                <>
                                    <span className="font-medium flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className={`text-xs px-2 py-1 rounded ${item.badge === 'Super'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                            : 'bg-accent/20 text-accent-foreground'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            {!isCollapsed && user?.email && (
                <div className="px-4 py-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted uppercase mb-1">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate" title={user.email}>
                        {user.email}
                    </p>
                </div>
            )}

            {/* Theme Toggle */}
            {!isCollapsed && (
                <div className="px-4 py-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted uppercase mb-2">Theme</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${theme === 'dark'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            Dark
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${theme === 'light'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-black hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            Light
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Button */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'justify-center' : ''
                        }`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
