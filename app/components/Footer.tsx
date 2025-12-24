export default function Footer() {
    return (
        <footer className="bg-background px-4 sm:px-6 py-12 border-t border-border">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center">
                    <p className="text-sm text-muted">
                        © 2024 StartEase Agent. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
