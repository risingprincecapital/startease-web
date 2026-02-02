'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import ServicesSection from './components/ServicesSection';
import DocumentCarousel from './components/DocumentCarousel';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section Split Layout */}
        <section id="home" className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

              {/* Left Column: Hero Text + CTA Cards */}
              <div className="space-y-8 flex flex-col justify-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-left">
                    StartEase
                  </h1>
                  <p className="mt-4 text-xl sm:text-2xl text-muted text-left">
                    Complete Business Operations Made Simple.
                  </p>
                </div>

                <div className="space-y-6 max-w-xl">
                  {/* Start New Business Card */}
                  <div className="bg-surface p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-foreground">
                      Simplify Your Business Formation Journey
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      Launch your new venture with confidence. We handle the paperwork so you can focus on building your dream.
                    </p>
                    <Link href="/login" className="mt-4 w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                      Start a New Business
                    </Link>
                  </div>

                  {/* Transfer Existing Business Card */}
                  <div className="bg-surface p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-foreground">
                      Already Have a Business?
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      We'll take it from here. Transfer your existing entity and let us manage your compliance and filings seamlessly.
                    </p>
                    <Link href="/login" className="mt-4 w-full sm:w-auto inline-flex items-center justify-center bg-foreground text-background font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity">
                      Transfer Existing Business
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Document Carousel */}
              <div className="hidden lg:block h-full">
                <DocumentCarousel />
              </div>

              {/* Mobile Carousel (Optional: strictly requested for right section, but good to have visible on mobile too if desired. 
                  For now, following strict 'right section' guidance which implies desktop split due to 'left and right'. 
                  Hidden on mobile for now to keep hero clean, or can be added below. 
                  Let's keep it visible on mobile but below cards? 
                  User said "divide in left and right section", implying desktop row. 
                  I'll show it on mobile too for completeness below the cards.
              */}
              <div className="lg:hidden">
                <DocumentCarousel />
              </div>

            </div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />

        <div className="widget-container">
          <div id="elephany"></div>
        </div>

        {/* Why StartEase Section */}
        <section id="why-startease" className="py-16 bg-surface px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Why StartEase
              </h2>
              <p className="mt-3 text-lg text-muted">
                It’s the operating system for forming, launching, and running a U.S. business.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {[
                {
                  title: 'Trust & Transparency',
                  description: 'Clear pricing. Zero surprises. What you see is what you pay formation, tax filings, and ongoing support delivered through a secure, auditable platform.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  ),
                },
                {
                  title: 'Unmatched Speed',
                  description: 'Speed is not a claim. It’s engineered. 3 days for formation, 10 days for EIN, and 3 days to initiate banking delivering a launch ready U.S. business in 15 days. No idle gaps. No dependency delays.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  ),
                },
                {
                  title: 'Expert Led, Personalized Support',
                  description: 'We don’t push you into ticket queues. You don’t wait on chatbots. You get real experts available via phone, WhatsApp, and email people who understand U.S. incorporation, IRS workflows, and non-resident founder realities.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  ),
                },
                {
                  title: 'Founder-Only Advantages',
                  description: 'Incorporation is step one. We stay with you for banking, tax filings, accounting, and compliance, so you can operate, invoice, and scale without friction. Built to run your business. Not just register it.',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeInOut" }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {feature.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-muted text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How it works
              </h2>
              <p className="mt-3 text-lg text-muted">
                Launch your business in four simple steps.
              </p>
            </div>


            {/* Two Column Layout */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Steps */}
              <div className="space-y-5">
                {[
                  {
                    step: 1,
                    title: 'Login & Get Started',
                    description: 'Create your account to begin the secure formation process.',
                  },
                  {
                    step: 2,
                    title: 'Complete the Business Wizard',
                    description: 'Answer a few simple questions about your new company.',
                  },
                  {
                    step: 3,
                    title: 'Smart Service Selection',
                    description: "We'll recommend the best package for your needs.",
                  },
                  {
                    step: 4,
                    title: 'Enjoy the Benefits',
                    description: 'Your business is formed! Access your dashboard and perks.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-6"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`h-12 w-12 rounded-full border-2 border-primary flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer ${item.step === 4 ? 'bg-primary text-white' : 'text-primary hover:bg-primary hover:text-white'}`}>
                        {item.step}
                      </div>
                      {item.step < 4 && <div className="w-px h-16 bg-border mt-4"></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-muted">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column - Contact Card (Bottom Aligned) */}
              <div className="flex items-end justify-end">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-surface border border-border rounded-lg p-6 max-w-sm shadow-lg w-full"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    For Consultation or Assistance
                  </h3>
                  <div className="h-px bg-border mb-4"></div>
                  <div className="space-y-3 text-sm">
                    <p className="text-foreground">
                      <a href="mailto:hi@starteaseai.com" className="hover:text-primary transition-colors">
                        hi@starteaseai.com
                      </a>
                    </p>
                    <p className="text-foreground">
                      <a href="tel:+12069849115" className="hover:text-primary transition-colors">
                        +1 (206) 984-9115
                      </a>
                    </p>
                    <p className="text-foreground">
                      <a
                        href="https://wa.me/starteaseagent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline transition-colors"
                      >
                        WhatsApp Support
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
