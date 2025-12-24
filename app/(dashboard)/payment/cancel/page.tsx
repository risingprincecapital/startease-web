'use client';

import { useRouter } from 'next/navigation';
import SettingsPanel from '@/app/components/SettingsPanel';

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
            <SettingsPanel />
            <div className="max-w-md w-full">
                <div className="bg-surface border border-border rounded-lg p-8 text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted/10 flex items-center justify-center">
                        <svg className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h2>
                    <p className="text-muted mb-6">
                        Your payment was cancelled. No charges have been made to your account.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.back()}
                            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full px-6 py-3 rounded-lg font-semibold text-foreground hover:bg-background transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
