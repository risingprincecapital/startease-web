import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const documents = [
    {
        id: 1,
        title: 'Delaware Formation Certificate',
        description: 'Official State Registration',
        src: '/assets/acknowledgement-sample/Delaware-US-Formation.jpg',
        color: 'bg-blue-100', // Placeholder
    },
    {
        id: 2,
        title: 'EIN Certificate',
        description: 'Tax ID Assignment',
        src: '/assets/acknowledgement-sample/EIN-Certificate.jpg',
        color: 'bg-green-100', // Placeholder
    },
    {
        id: 3,
        title: 'EIN Application SS-4',
        description: 'IRS Filing Document',
        src: '/assets/acknowledgement-sample/EIN-Application-SS-4.png',
        color: 'bg-yellow-100', // Placeholder
    },
    {
        id: 4,
        title: 'Business Credit Card',
        description: 'Financial Foundation',
        src: '/assets/acknowledgement-sample/US-Credit-Card.png',
        color: 'bg-purple-100', // Placeholder
    },
];

export default function DocumentCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedImage) return; // Pause rotation if modal is open

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % documents.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(timer);
    }, [selectedImage]);

    return (
        <>
            <div className="w-full max-w-2xl mx-auto p-6 bg-surface rounded-2xl border border-border/50 shadow-sm h-full flex flex-col">
                <div className="mb-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground">Verified Documents</h3>
                    <p className="text-sm text-muted mt-1">
                        Real examples of what you'll receive. Click to view full screen.
                    </p>
                </div>

                <div className="relative flex-1 w-full overflow-hidden perspective-1000 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, rotateY: -20, x: 100 }}
                            animate={{ opacity: 1, rotateY: 0, x: 0 }}
                            exit={{ opacity: 0, rotateY: 20, x: -100 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-4"
                        >
                            <div
                                onClick={() => documents[currentIndex].src && setSelectedImage(documents[currentIndex].src)}
                                className={`w-full h-full rounded-xl shadow-lg border border-border flex items-center justify-center p-4 transform hover:scale-[1.02] transition-transform duration-300 bg-white cursor-pointer group`}
                            >
                                {/* Render real image if src exists */}
                                {documents[currentIndex].src ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={documents[currentIndex].src}
                                            alt={documents[currentIndex].title}
                                            className="w-full h-full object-contain rounded"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-white rounded shadow-sm p-6 flex flex-col space-y-4">
                                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                                        <div className="h-2 w-3/4 bg-gray-100 rounded"></div>

                                        <div className="flex-grow flex items-center justify-center opacity-10">
                                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <p className="font-semibold text-lg text-foreground">{documents[currentIndex].title}</p>
                                <p className="text-sm text-muted">{documents[currentIndex].description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-center space-x-2">
                    {documents.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-border/80'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Full Screen Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.button
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            src={selectedImage}
                            alt="Full Screen View"
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
