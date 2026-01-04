'use client';

import { motion } from 'framer-motion';
import {
    Rocket,
    Bolt,
    IdCard,
    FileCheck,
    ShieldCheck,
    FileText,
    Calculator,
    Users,
    Building,
    MapPin,
    LineChart,
    FileUser
} from 'lucide-react';

const services = [
    {
        title: 'Formation Fast Track',
        description: [
            'Accelerated U.S. company formation with a fixed launch timeline.',
            '3 days for state formation, ~10 days for EIN processing, and ~3 days to initiate banking.',
            'End-to-end setup designed to deliver a launch-ready business in ~15 days.'
        ],
        pricing: 'All-inclusive $500 USD',
        icon: Rocket,
        secondaryIcon: Bolt
    },
    {
        title: 'EIN Fast Track',
        description: [
            'Dedicated EIN application service with immediate IRS submission and active status tracking.',
            'Designed for founders who already have a U.S. entity and need their EIN issued in ~10 days without delays.'
        ],
        pricing: 'Fast Track $99 USD',
        icon: IdCard,
        secondaryIcon: FileCheck
    },
    {
        title: 'Registered Agent + Annual Filings',
        description: [
            'Registered Agent service at $99/year, with annual state filings support included. No hidden renewals. No missed compliance.'
        ],
        pricing: '$99/year',
        icon: ShieldCheck,
        secondaryIcon: FileText
    },
    {
        title: 'LLC Tax Filing — Single Member',
        description: [
            'Federal tax filing for single-member LLCs treated as disregarded entities. Prepared and filed under IRS compliance standards.'
        ],
        pricing: '$599 — Forms 1120 + 5472',
        icon: Calculator
    },
    {
        title: 'LLC Tax Filing — Multi Member',
        description: [
            'Partnership tax filing with profit allocation and member reporting, filed with full IRS compliance.'
        ],
        pricing: '$699 — Form 1065 + K-1',
        icon: Users
    },
    {
        title: 'Personal Tax Return — Non-Resident',
        description: [
            'U.S. individual tax return filing for non-resident taxpayers with U.S. source income.'
        ],
        pricing: '$199 — Form 1040-NR',
        icon: FileUser
    },
    {
        title: 'C-Corporation Tax Filing',
        description: [
            'Corporate federal tax filing with structured reporting and compliance-first review.'
        ],
        pricing: '$899 — includes Free Tax Filings Support',
        icon: Building
    },
    {
        title: 'Mailing Address',
        description: [
            'Professional U.S. business address for registrations, banking, and official correspondence. Designed to meet state and banking requirements.'
        ],
        pricing: '$149/year — fixed fee, valid across all 50 states',
        icon: MapPin,
        secondaryIcon: Building
    },
    {
        title: 'Accounting Service',
        description: [
            'Monthly bookkeeping and financial tracking designed for early-stage U.S. businesses.'
        ],
        pricing: 'Starts at $99/month (up to $10K monthly revenue)',
        icon: LineChart
    }
];

export default function ServicesSection() {
    const firstRow = services.slice(0, 5);
    const secondRow = services.slice(5);

    return (
        <section id="services" className="py-16 px-4 sm:px-6 bg-surface/50 overflow-hidden">
            <div className="container mx-auto max-w-[1269px]">
                <div className="text-center mb-12 px-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Our Services
                    </h2>
                    <p className="mt-3 text-lg text-muted">
                        Comprehensive solutions for every stage of your business journey.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* First Row - 5 Cards */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {firstRow.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>

                    {/* Second Row - 4 Cards */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {secondRow.map((service, index) => (
                            <ServiceCard key={index + 5} service={service} index={index + 5} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: (index % 5) * 0.1,
                ease: "easeOut"
            }}
            className="bg-background p-5 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(20%-1rem)] min-w-[240px] max-w-[280px]"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <service.icon className="w-5 h-5" />
                </div>
                {service.secondaryIcon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <service.secondaryIcon className="w-5 h-5" />
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
                {service.title}
            </h3>

            <div className="space-y-1.5 mb-4 flex-grow">
                {service.description.map((desc: string, i: number) => (
                    <p key={i} className="text-xs text-muted leading-relaxed">
                        {desc}
                    </p>
                ))}
            </div>

            <div className="pt-3 border-t border-border mt-auto">
                <p className="text-sm font-semibold text-primary">
                    {service.pricing}
                </p>
            </div>
        </motion.div>
    );
}
