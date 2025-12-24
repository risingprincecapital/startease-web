'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SettingsPanel from '@/app/components/SettingsPanel';
import { useToast } from '@/app/contexts/ToastContext';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (sessionId) {
            verifyPayment();
        } else {
            setStatus('error');
            setError('No session ID provided');
        }
    }, [sessionId]);

    const verifyPayment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify-session/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment verification failed');
            }

            if (data.status === 'paid') {
                // Add products to business
                // await addProductsToBusiness(data.businessId, data.productIds);
                setBusinessId(data.businessId);
                setStatus('success');

                // Redirect to business page after 3 seconds
                setTimeout(() => {
                    router.push(`/businesses/${data.businessId}`);
                }, 3000);
            } else {
                throw new Error('Payment not completed');
            }
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Failed to verify payment');
            showToast(err.message || 'Failed to verify payment', 'error');
        }
    };

    // const addProductsToBusiness = async (businessId: string, productIds: string[]) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/products`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({ productIds }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to add products to business');
    //         }
    //     } catch (err) {
    //         console.error('Error adding products:', err);
    //         // Don't fail the whole flow if this fails
    //     }
    // };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
            <SettingsPanel />
            <div className="max-w-md w-full">
                {status === 'verifying' && (
                    <div className="bg-surface border border-border rounded-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verifying Payment</h2>
                        <p className="text-muted">Please wait while we confirm your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-surface border border-border rounded-lg p-8 text-center">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                        <p className="text-muted mb-6">Your products have been added to your business.</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/businesses/${businessId}`)}
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                View Business
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full px-6 py-3 rounded-lg font-semibold text-foreground hover:bg-background transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                        <p className="text-xs text-muted mt-4">Redirecting automatically in 3 seconds...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-surface border border-border rounded-lg p-8 text-center">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <svg className="h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h2>
                        <p className="text-muted mb-6">{error || 'Something went wrong'}</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
