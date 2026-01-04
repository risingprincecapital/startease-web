'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/app/contexts/ToastContext';

import TermsModal from '@/app/components/TermsModal';
import PrivacyPolicyModal from '@/app/components/PrivacyPolicyModal';
import {
    Rocket,
    Scale,
    Map,
    FileText,
    BadgeCheck,
    Landmark,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';

const steps = [
    {
        title: "BUSINESS IDENTITY",
        subtitle: "Business Name & Description",
        description: [
            "Enter the Business name to be registered. This will be used across state filings, IRS records, banking, and contracts.",
            "Tip: Don't overthink branding here. This is a legal identifier.",
            "What your business does — clearly and directly. Used for EIN, banking, and compliance.",
            "Good examples: 'Provides software development and IT consulting services...' or 'Operates an e-commerce business...'"
        ],
        icon: Rocket
    },
    {
        title: "Entity Selection",
        subtitle: "Choose the structure regulators and investors expect",
        description: [
            "LLC: Best for operational flexibility and pass-through taxation. Used when control, simplicity, and cost efficiency matter.",
            "C-Corporation: Mandatory for venture funding and equity structuring. Separate tax identity. Share-based ownership. Scalable governance.",
            "We don't let founders pick blindly. We align structure to intent."
        ],
        icon: Scale
    },
    {
        title: "U.S. State Selection",
        subtitle: "Your state determines future friction",
        description: [
            "Delaware: Court of Chancery. Predictable case law. The default for institutional capital.",
            "Wyoming: Low statutory burden. Minimal reporting. Optimized for closely held companies.",
            "This decision affects taxes, compliance, and exits. We treat it accordingly."
        ],
        icon: Map
    },
    {
        title: "EIN Issuance",
        subtitle: "The real bottleneck, handled correctly",
        description: [
            "We act as an authorized third party with the IRS.",
            "No SSN. No ITIN. No U.S. residency required.",
            "You receive: EIN confirmation, IRS acknowledgment, Federal tax identity established.",
            "This unlocks banking, payroll, and filings."
        ],
        icon: BadgeCheck
    },
    {
        title: "Business Banking Enablement",
        subtitle: "Mercury Banking Partnership",
        description: [
            "Seamlessly integrated banking setup, typically initiated within 3 days.",
            "Applications are aligned with IRS and state records to reduce friction.",
            "Bank approval remains subject to partner review."
        ],
        icon: Landmark
    },
    {
        title: "Registered Agent & US Presence",
        subtitle: "Compliance is not optional",
        description: [
            "A registered agent is mandatory under state law.",
            "A US address is required for official correspondence.",
            "We provide both — continuously monitored, renewals handled."
        ],
        icon: ShieldCheck
    },
    {
        title: "Filing & Government Handling",
        subtitle: "We interface directly with authorities",
        description: [
            "State formation filings.",
            "IRS submissions.",
            "Continuous tracking until completion.",
            "No founder follow-ups. No portal confusion. No silent delays."
        ],
        icon: FileText
    },
    {
        title: "Built for Ongoing Compliance",
        subtitle: "Formation is step one",
        description: [
            "Once live, your company needs: Annual filings, Federal tax alignment, State compliance continuity.",
            "Our platform is designed to carry companies beyond incorporation — not abandon them after approval."
        ],
        icon: RefreshCw
    }
];

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail, verifyOTP } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    // Resend OTP State
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Sticky headers state
    const [visibleHeaders, setVisibleHeaders] = useState<number[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [otpSent, resendTimer]);

    // Scroll handler for sticky headers
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollTop = container.scrollTop;

        // Calculate which headers should be visible based on scroll position
        const cardElements = container.querySelectorAll('[data-card-index]');
        const visible: number[] = [];

        cardElements.forEach((card) => {
            const index = parseInt(card.getAttribute('data-card-index') || '0');
            const cardTop = (card as HTMLElement).offsetTop;

            // Show header as soon as the card's header section scrolls past the top
            // Adding a small threshold (50px) to account for the header height
            if (scrollTop > cardTop + 50) {
                visible.push(index);
            }
        });

        // Keep only the last 2 headers
        const lastTwo = visible.slice(-2);
        setVisibleHeaders(lastTwo);
    };

    // Scroll to a specific card when header is clicked
    const scrollToCard = (index: number) => {
        if (!scrollContainerRef.current) return;

        const cardElement = scrollContainerRef.current.querySelector(`[data-card-index="${index}"]`);
        if (cardElement) {
            const cardTop = (cardElement as HTMLElement).offsetTop;
            scrollContainerRef.current.scrollTo({
                top: cardTop - 20, // Small offset for better visibility
                behavior: 'smooth'
            });
        }
    };

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
            setResendTimer(30); // Reset timer on successful send
            setCanResend(false);
            showToast('OTP sent to your email', 'success');
        } catch (err: any) {
            // Error handled by AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        setLoading(true);
        try {
            await loginWithEmail(email);
            setResendTimer(30);
            setCanResend(false);
            showToast('OTP resent successfully', 'success');
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
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            {/* Header / Logo */}
            <div className="flex-none flex justify-center py-6 border-b border-border/50 bg-background z-20">
                <Link href="/" className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-surface transition-colors">
                    <Image
                        src="/logo.jpg"
                        alt="StartEase logo"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-lg"
                    />
                    <span className="font-bold text-xl text-foreground">StartEase</span>
                </Link>
            </div>

            {/* Split Layout Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Scrollable Steps */}
                <div
                    ref={scrollContainerRef}
                    className="hidden lg:block w-1/2 h-full overflow-y-auto border-r border-border scrollbar-hide relative"
                    onScroll={handleScroll}
                >
                    {/* Fixed Sticky Headers Area */}
                    {visibleHeaders.length > 0 && (
                        <div className="sticky top-0 z-20 bg-background border-b border-border/50">
                            {visibleHeaders.map((index) => (
                                <div
                                    key={index}
                                    onClick={() => scrollToCard(index)}
                                    className="py-3 px-12 border-b border-border/30 bg-background/95 backdrop-blur-sm cursor-pointer hover:bg-primary/5 transition-colors"
                                >
                                    <span className="text-xs font-mono text-primary mb-1 block tracking-wider">STEP {index + 1}</span>
                                    <h3 className="text-lg font-bold text-foreground">{steps[index].title}</h3>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-12 pb-12 px-12 space-y-2">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative min-h-[400px] flex flex-col group"
                                data-card-index={index}
                            >
                                {/* Card Header (non-sticky) */}
                                <div className="py-4 border-b border-border/50 mb-6">
                                    <span className="text-xs font-mono text-primary mb-2 block tracking-wider">STEP {index + 1}</span>
                                    <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                                </div>

                                {/* Card Content */}
                                <div className="flex-grow p-8 bg-surface rounded-2xl border border-border group-hover:border-primary/50 transition-colors duration-300 relative overflow-hidden">
                                    <h4 className="text-lg font-semibold text-foreground mb-4">{step.subtitle}</h4>
                                    <ul className="space-y-3 mb-12">
                                        {step.description.map((desc, i) => (
                                            <li key={i} className="text-muted leading-relaxed flex items-start">
                                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Icon at Bottom Right */}
                                    <div className="absolute bottom-6 right-6 p-4 bg-primary/10 rounded-2xl text-primary transform group-hover:scale-110 transition-transform duration-500">
                                        <step.icon className="w-12 h-12" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Bottom Padding */}
                        <div className="h-24"></div>
                    </div>
                </div>

                {/* Right Column: Login Form */}
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 overflow-y-auto relative">
                    {/* Mobile Logo Visibility Helper (already in header but might need space) */}
                    <div className="lg:hidden h-24 w-full"></div>

                    <div className="w-full max-w-md space-y-8">
                        <div className="flex flex-col items-center text-center">
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
                                            placeholder="Enter your email address"
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

                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={!canResend || loading}
                                            className={`text-primary hover:text-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${!canResend ? 'text-muted' : ''}`}
                                        >
                                            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOtpSent(false);
                                                setOTP('');
                                                setResendTimer(30);
                                                setCanResend(false);
                                            }}
                                            className="text-muted hover:text-foreground transition-colors"
                                        >
                                            Change Email
                                        </button>
                                    </div>
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
                                <button
                                    type="button"
                                    onClick={() => setIsTermsOpen(true)}
                                    className="underline hover:text-primary bg-transparent border-none p-0 cursor-pointer text-inherit"
                                >
                                    Terms of Service
                                </button>{' '}
                                and{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsPrivacyOpen(true)}
                                    className="underline hover:text-primary bg-transparent border-none p-0 cursor-pointer text-inherit"
                                >
                                    Privacy Policy
                                </button>
                                .
                            </div>
                        </div>
                    </div>

                    <TermsModal
                        isOpen={isTermsOpen}
                        onClose={() => setIsTermsOpen(false)}
                    />
                    <PrivacyPolicyModal
                        isOpen={isPrivacyOpen}
                        onClose={() => setIsPrivacyOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
}
