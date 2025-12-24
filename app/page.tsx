'use client';

import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-left">
              StartEase
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-muted text-left">
              Complete Business Formation Made Simple.
            </p>
          </div>
        </section>

        {/* CTA Cards Section - Smaller, Stacked */}
        <section className="px-4 sm:px-6 pb-16">
          <div className="container mx-auto max-w-4xl space-y-6">
            {/* Start New Business Card */}
            <div className="bg-surface p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
              <h2 className="text-xl font-semibold text-foreground">
                Simplify Your Business Formation Journey
              </h2>
              <p className="mt-2 text-sm text-muted">
                Launch your new venture with confidence. We handle the paperwork so you can focus on building your dream.
              </p>
              <button className="mt-4 w-full sm:w-auto bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                Start a New Business
              </button>
            </div>

            {/* Transfer Existing Business Card */}
            <div className="bg-surface p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
              <h2 className="text-xl font-semibold text-foreground">
                Already Have a Business?
              </h2>
              <p className="mt-2 text-sm text-muted">
                We'll take it from here. Transfer your existing entity and let us manage your compliance and filings seamlessly.
              </p>
              <button className="mt-4 w-full sm:w-auto bg-foreground text-background font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity">
                Transfer Existing Business
              </button>
            </div>
          </div>
        </section>

        {/* Why StartEase Section */}
        <section className="py-16 bg-surface px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Why StartEase
              </h2>
              <p className="mt-3 text-lg text-muted">
                The smartest way to start and run your business.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Trust & Transparency
                  </h3>
                  <p className="mt-1 text-muted">
                    No hidden fees, ever. Clear pricing and a secure platform you can rely on.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Unmatched Speed
                  </h3>
                  <p className="mt-1 text-muted">
                    Get your business formed in record time with our streamlined digital process.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Personalized Support
                  </h3>
                  <p className="mt-1 text-muted">
                    Our team of experts is here to guide you through every step of the process.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Exclusive Benefits
                  </h3>
                  <p className="mt-1 text-muted">
                    Access a curated set of tools and offers to help your business succeed from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How it works
              </h2>
              <p className="mt-3 text-lg text-muted">
                Launch your business in four simple steps.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {/* Step 1 */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                    1
                  </div>
                  <div className="w-px h-16 bg-border mt-4"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Login & Get Started
                  </h3>
                  <p className="mt-1 text-muted">
                    Create your account to begin the secure formation process.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                    2
                  </div>
                  <div className="w-px h-16 bg-border mt-4"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Complete the Business Wizard
                  </h3>
                  <p className="mt-1 text-muted">
                    Answer a few simple questions about your new company.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                    3
                  </div>
                  <div className="w-px h-16 bg-border mt-4"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Smart Service Selection
                  </h3>
                  <p className="mt-1 text-muted">
                    We'll recommend the best package for your needs.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Enjoy the Benefits
                  </h3>
                  <p className="mt-1 text-muted">
                    Your business is formed! Access your dashboard and perks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-surface px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-3 text-lg text-muted">
                Choose the plan that's right for you. No hidden fees.
              </p>
            </div>

            <div className="mt-12 space-y-8 max-w-2xl">
              {/* Basic Plan */}
              <div className="border border-border rounded-lg p-6 bg-background">
                <h3 className="text-lg font-semibold text-foreground">Basic</h3>
                <p className="mt-2 text-muted">Perfect for getting started.</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-foreground">$199</span>
                  <span className="text-muted">/ one-time</span>
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted">Business Formation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted">Registered Agent Service</span>
                  </li>
                </ul>
                <button className="mt-6 w-full bg-foreground text-background font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-primary rounded-lg p-6 relative bg-background">
                <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
                <h3 className="text-lg font-semibold text-primary">Pro</h3>
                <p className="mt-2 text-muted">For businesses aiming to scale.</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-foreground">$499</span>
                  <span className="text-muted">/ one-time</span>
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted">Everything in Basic</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted">EIN Obtainment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-muted">Compliance Monitoring</span>
                  </li>
                </ul>
                <button className="mt-6 w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                  Choose Pro
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
