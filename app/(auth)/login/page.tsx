'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/app/contexts/ToastContext';

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail, verifyOTP } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                await loginWithGoogle(credentialResponse.credential);
            }
        } catch (err: any) {
            // Error handled by AuthContext toast
        }
    };

    const handleGoogleError = () => {
        showToast('Google Login Failed', 'error');
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await loginWithEmail(email);
            setOtpSent(true);
            showToast('OTP sent to your email', 'success');
        } catch (err: any) {
            // Error handled by AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await verifyOTP(email, otp);
            showToast('Login successful', 'success');
        } catch (err: any) {
            // Error handled by AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="flex items-center space-x-2 mb-8">
                        <Image
                            src="/logo.jpg"
                            alt="StartEase logo"
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg"
                        />
                        <span className="font-bold text-2xl text-foreground">StartEase</span>
                    </Link>

                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Start Your Business Journey
                    </h2>
                    <p className="mt-2 text-muted">
                        Sign in to create and manage your business
                    </p>
                </div>

                <div className="mt-8 space-y-6">

                    {/* Email Login Form */}
                    {!otpSent ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Continue with Email'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                                    Enter OTP
                                </label>
                                <p className="text-sm text-muted mb-3">
                                    We sent a code to {email}
                                </p>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOTP('');
                                }}
                                className="w-full text-sm text-muted hover:text-foreground transition-colors"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    {!otpSent && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-muted">OR</span>
                                </div>
                            </div>

                            {/* Google Login */}
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_blue"
                                    size="large"
                                    text="continue_with"
                                    shape="pill"
                                />
                            </div>
                        </>
                    )}

                    <div className="text-center text-sm text-muted">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-primary">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </div>
            </div>
        </div>
    );
}
