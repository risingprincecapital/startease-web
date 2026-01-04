import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl max-h-[85vh] bg-surface rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50 backdrop-blur">
                            <h2 className="text-xl font-semibold text-foreground">Terms and Conditions</h2>
                            <button
                                onClick={onClose}
                                className="text-muted hover:text-foreground transition-colors p-2 rounded-full hover:bg-black/5"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 text-sm sm:text-base text-muted space-y-6 leading-relaxed">
                            <div>
                                <p className="font-semibold text-foreground">Effective Date: 01-01-2025</p>
                                <p className="font-semibold text-foreground">Last Updated: 30-12-2025</p>
                            </div>

                            <p>
                                These Terms and Conditions (“Terms”) govern access to and use of the StartEase platform, website, dashboards, APIs, and all related tools and services (collectively, the “Platform”).
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">1. Introduction & Acceptance</h3>
                                <p>
                                    <strong>By accessing or using the Platform, you agree to be legally bound by these Terms.</strong> If you do not agree, you must not use the Platform.
                                </p>
                                <p>
                                    <strong>StartEase is a software platform, not a professional services firm.</strong> StartEase operates as a technology-enabled orchestration layer that facilitates business formation, compliance workflows, tax filing coordination, and third-party integrations.
                                </p>
                                <div>
                                    <p className="font-semibold text-foreground mb-2">StartEase does not act as:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>A law firm or provider of legal advice</strong></li>
                                        <li><strong>A CPA firm or tax advisory practice</strong></li>
                                        <li><strong>A fiduciary, trustee, or financial institution</strong></li>
                                        <li><strong>A government authority or regulator</strong></li>
                                    </ul>
                                </div>
                                <p className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-primary-800">
                                    <strong>All decisions, filings, disclosures, and regulatory obligations remain the sole responsibility of the user.</strong> This classification is central to StartEase’s risk posture and operating model.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">2. Service Architecture & Responsibility Allocation</h3>
                                <div>
                                    <h4 className="font-semibold text-foreground">2.1 Platform Responsibilities</h4>
                                    <p className="mb-2">StartEase is responsible for:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Providing secure workflows and automation</li>
                                        <li>Facilitating filings based on user-submitted data</li>
                                        <li>Coordinating with third-party service providers</li>
                                        <li>Delivering compliance reminders and status visibility</li>
                                        <li>Providing human support channels (phone, WhatsApp, email)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">2.2 Customer Responsibilities</h4>
                                    <p className="mb-2"><strong>User remain responsible for:</strong></p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Accuracy and completeness of all submitted data</strong></li>
                                        <li>Business decisions and regulatory interpretations</li>
                                        <li>Tax liabilities, penalties, and enforcement outcomes</li>
                                        <li>Ongoing legal and statutory compliance</li>
                                    </ul>
                                    <p className="mt-2">StartEase does not validate business legality or tax positions.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">3. No-Advice & Reliance Disclaimer (Investor-Critical)</h3>
                                <p>All information provided on the Platform is: Procedural, Informational, and Execution-oriented.</p>
                                <p className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-900">
                                    <strong>Nothing on the Platform constitutes legal, tax, accounting, or financial advice.</strong> Users acknowledge they do not rely on StartEase for professional judgment and waive any claim based on perceived advisory reliance.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">4. Government & Third-Party Dependency Framework</h3>
                                <p>Certain outcomes depend on external authorities, including: U.S. state registrars, Internal Revenue Service (IRS), Banking institutions, Registered Agent providers, and Virtual office vendors.</p>
                                <div>
                                    <p className="font-semibold text-foreground">StartEase:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Does not control approval decisions</li>
                                        <li>Does not guarantee timelines or outcomes</li>
                                        <li><strong>Is not liable for rejections, suspensions, or delays</strong></li>
                                    </ul>
                                    <p className="mt-2">This dependency model is explicitly disclosed to users.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">5. Speed Claims & Timeline Governance</h3>
                                <p>Published timelines (e.g., “3 days”, “10 days”, “15 days”) represent internal process benchmarks, not service guarantees. Actual timelines may vary due to: Government backlogs, Bank compliance reviews, Third-party processing windows, User response delays.</p>
                                <p><strong>StartEase disclaims liability for any deviation outside its control.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">6. Financial & Payment Controls</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Fees are disclosed upfront</li>
                                    <li><strong>Execution-based services are non-refundable once initiated</strong></li>
                                    <li>Subscriptions renew annually unless cancelled</li>
                                    <li>Government fees and penalties are pass-through costs</li>
                                    <li>Abuse of payment systems or chargebacks may result in suspension.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">7. Tax Filing Risk Containment</h3>
                                <p>Tax filings are prepared strictly from user-provided data. Customers retain full responsibility for: Income classification, Disclosure accuracy, Audit defense, Penalties and interest.</p>
                                <p><strong>StartEase does not represent users before tax authorities unless explicitly agreed in writing.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">8. Banking Enablement Disclaimer</h3>
                                <p>
                                    StartEase is not a bank and does not hold customer funds. Banking access is provided by third-party institutions that: Control approval decisions, Enforce independent compliance rules, May freeze or close accounts without notice.
                                </p>
                                <p><strong>StartEase bears no liability for banking actions.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">9. Data Protection & Access Control (High-Level)</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Access is role-based and permissioned</li>
                                    <li>Data is processed only to deliver Platform functionality</li>
                                    <li><strong>StartEase does not sell customer data</strong></li>
                                    <li>Data retention aligns with operational necessity and legal requirements</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">10. Intellectual Property Protection</h3>
                                <p>All Platform logic, workflows, automation systems, templates, and content are the exclusive intellectual property of StartEase. Customers receive a limited, revocable license to use the Platform as intended.</p>
                                <p><strong>Reverse engineering, scraping, or resale is prohibited.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">11. Indemnification Structure</h3>
                                <p>Customers agree to indemnify StartEase against claims arising from: Their business activities, Regulatory or tax violations, False or misleading information, Misuse of Platform services. This indemnity survives termination.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">12. Limitation of Liability</h3>
                                <p><strong>To the maximum extent permitted by law:</strong></p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>No liability for indirect or consequential damages</strong></li>
                                    <li><strong>No liability for lost revenue or business interruption</strong></li>
                                    <li><strong>Total liability capped at fees paid for the specific service</strong></li>
                                </ul>
                                <p>This cap is a core risk-containment mechanism.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">13. Suspension & Termination Rights</h3>
                                <p><strong>StartEase may suspend or terminate access without notice if:</strong></p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Legal or regulatory risk is detected</li>
                                    <li>Fraud or misrepresentation occurs</li>
                                    <li>Payments fail or are disputed</li>
                                    <li>Platform abuse is identified</li>
                                </ul>
                                <p>Termination does not waive accrued obligations.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">14. Governing Law & Jurisdiction</h3>
                                <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Exclusive jurisdiction for any disputes arising under or in connection with these Terms shall vest in the courts designated by StartEase’s operating entity.</p>
                                <p>StartEase operates as a compliance-native operating system that orchestrates U.S. business formation, tax workflows, and regulatory execution, without assuming any advisory, fiduciary, or professional responsibility.</p>
                                <p className="text-sm text-muted">For legal inquiries, you may contact us at <a href="mailto:legal@starteaseai.com" className="text-primary hover:underline">legal@starteaseai.com</a>.</p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-border bg-surface/50 backdrop-blur flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                            >
                                I Understand
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
