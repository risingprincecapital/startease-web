import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-background px-4 sm:px-6 py-6 border-t border-border">
            <div className="container mx-auto">
                {/* Ready to Start Section */}
                <div className="pb-4 text-center space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        Ready to start?
                    </h2>
                    <p className="text-sm text-muted max-w-2xl mx-auto">
                        Create a new StartEase account today and get started in minutes.
                    </p>
                    <div className="my-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center bg-primary text-white font-semibold py-3 px-10 rounded-lg shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                        >
                            Start your company
                        </Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-border text-center">
                    <p className="text-sm text-muted">
                        © 2026 StartEaseAI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
