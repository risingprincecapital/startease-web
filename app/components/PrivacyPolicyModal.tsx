import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
                            <h2 className="text-xl font-semibold text-foreground">Privacy Policy</h2>
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
                                This Privacy Policy explains how StartEase (“StartEase,” “we,” “our,” or “us”) collects, uses, stores, discloses, and protects personal data when you access or use our platform, website, dashboards, APIs, and related services (collectively, the “Platform”).
                            </p>
                            <p>
                                <strong>By using the Platform, you agree to the practices described in this Privacy Policy.</strong>
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">1. Our Role & Data Positioning</h3>
                                <p>StartEase operates as a technology platform that facilitates business formation, compliance workflows, tax filing coordination, and integrations with third-party service providers.</p>
                                <div>
                                    <p className="mb-2">For most data processed on the Platform:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>You are the data controller</strong></li>
                                        <li>StartEase acts as a data processor or service provider</li>
                                    </ul>
                                </div>
                                <p>We process data strictly to deliver Platform functionality and do not sell personal data.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">2. Information We Collect</h3>

                                <div>
                                    <h4 className="font-semibold text-foreground">2.1 Information You Provide Directly</h4>
                                    <p className="mb-2">We may collect information you submit, including:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Name, email address, phone number</li>
                                        <li>Business and entity details</li>
                                        <li>Identity and verification information required for compliance</li>
                                        <li>Tax-related and filing information</li>
                                        <li>Communication records (email, WhatsApp, phone)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-foreground">2.2 Information Collected Automatically</h4>
                                    <p className="mb-2">When you use the Platform, we may collect:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>IP address and device identifiers</li>
                                        <li>Browser type and operating system</li>
                                        <li>Log files, timestamps, and usage data</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-foreground">2.3 Third-Party Data</h4>
                                    <p className="mb-2">We may receive data from:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Registered Agent providers</li>
                                        <li>Government portals (status updates only)</li>
                                        <li>Banking and financial partners</li>
                                        <li>Compliance and filing vendors</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">3. Purpose of Data Processing</h3>
                                <p className="mb-2">We process personal data for the following purposes:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Account creation and authentication</li>
                                    <li>Delivering Platform services and workflows</li>
                                    <li>Facilitating filings and compliance tasks</li>
                                    <li>Communicating service updates and alerts</li>
                                    <li>Security, fraud prevention, and risk management</li>
                                    <li>Legal, regulatory, and contractual compliance</li>
                                </ul>
                                <p>We do not use your data for unrelated profiling or resale.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">4. Legal Basis for Processing</h3>
                                <p className="mb-2">Depending on jurisdiction, we rely on one or more of the following legal bases:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Performance of a contract</li>
                                    <li>Compliance with legal obligations</li>
                                    <li>Legitimate business interests</li>
                                    <li>User consent, where required by law</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">5. Data Sharing & Disclosure</h3>
                                <p className="mb-2">We may share data only with:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Government authorities (as required for filings)</li>
                                    <li>Third-party service providers executing Platform services</li>
                                    <li>Banks and financial institutions (with user authorization)</li>
                                    <li>Legal or regulatory authorities where legally required</li>
                                </ul>
                                <p><strong>We do not sell personal data or share it for advertising purposes.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">6. International Data Transfers</h3>
                                <p>As a global platform, data may be processed or stored outside your country of residence, including in the United States.</p>
                                <p>Where required, StartEase implements appropriate safeguards to ensure lawful cross-border data transfers.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">7. Data Retention</h3>
                                <p className="mb-2">We retain personal data only for as long as necessary to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Provide Platform services</li>
                                    <li>Meet legal and regulatory obligations</li>
                                    <li>Resolve disputes and enforce agreements</li>
                                </ul>
                                <p>Retention periods may vary depending on data type and jurisdiction.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">8. Data Security</h3>
                                <p className="mb-2">StartEase implements commercially reasonable technical and organizational safeguards, including:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Role-based access controls</li>
                                    <li>Secure authentication mechanisms</li>
                                    <li>Encryption in transit and at rest where applicable</li>
                                    <li>Monitoring for unauthorized access</li>
                                </ul>
                                <p><strong>No system is completely secure. We cannot guarantee absolute security.</strong></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">9. User Rights</h3>
                                <p className="mb-2">Depending on applicable law, you may have the right to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Access your personal data</li>
                                    <li>Request correction or deletion</li>
                                    <li>Restrict or object to processing</li>
                                    <li>Request data portability</li>
                                    <li>Withdraw consent (where applicable)</li>
                                </ul>
                                <p>Requests may be subject to legal and operational limitations.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">10. Cookies & Tracking Technologies</h3>
                                <p className="mb-2">We use cookies and similar technologies to:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Enable core Platform functionality</li>
                                    <li>Improve performance and user experience</li>
                                    <li>Monitor usage analytics</li>
                                </ul>
                                <p>You may control cookies through your browser settings.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">11. Children’s Privacy</h3>
                                <p>The Platform is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">12. Third-Party Links & Services</h3>
                                <p>The Platform may contain links to third-party websites or services. StartEase is not responsible for the privacy practices of such third parties.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">13. Changes to This Policy</h3>
                                <p>We may update this Privacy Policy from time to time. Material changes will be posted on the Platform. Continued use constitutes acceptance.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">14. Governing Law</h3>
                                <p>This Privacy Policy shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-foreground">15. Contact</h3>
                                <p>For privacy-related inquiries, requests, or concerns, contact: <a href="mailto:legal@starteaseai.com" className="text-primary hover:underline">legal@starteaseai.com</a></p>
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
