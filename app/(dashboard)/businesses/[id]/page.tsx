'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Business, ProductDetail } from '@/types/business';
import { Product } from '@/types/product';
import SettingsPanel from '@/app/components/SettingsPanel';
import ProductProgressCard from '@/app/components/ProductProgressCard';
import DocumentUpload from '@/app/components/DocumentUpload';
import DocumentPreview from '@/app/components/DocumentPreview';
import BusinessDetailsExpanded from '@/app/components/BusinessDetailsExpanded';
import { useToast } from '@/app/contexts/ToastContext';
import { environment } from '@/app/utils/env';

export default function BusinessDetailPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params.id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
    const [missingDocuments, setMissingDocuments] = useState<Array<{
        docName: string;
        description: string;
        productId: string;
        productName: string;
    }>>([]);
    const [activeAction, setActiveAction] = useState<'documents' | 'reports' | null>(null);
    const productRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const { showToast } = useToast();
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    useEffect(() => {
        fetchBusinessDetails();
        fetchRecommendedProducts();
        fetchUploadedDocuments();
    }, [businessId]);

    useEffect(() => {
        // Calculate missing documents whenever products or uploadedDocuments change
        if (products.length > 0) {
            calculateMissingDocuments();
        }
    }, [products, uploadedDocuments]);

    const fetchBusinessDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/businesses/${businessId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBusiness(data.business);
                setProducts(data.business.productDetails || []);
                // Recommended products are already filtered on the backend
                setRecommendedProducts(data.business.recommendedProduct?.map((rp: any) => rp.productId) || []);
            } else {
                throw new Error('Failed to fetch business details');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to load business', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendedProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/businesses/${businessId}/recommended-products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Only set if not already set from business details
                if (recommendedProducts.length === 0) {
                    setRecommendedProducts(data.recommendedProducts || []);
                }
            }
        } catch (err) {
            console.error('Failed to fetch recommended products:', err);
            showToast('Failed to fetch recommended products', 'error');
        }
    };

    const handleDocumentUpload = (productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            setSelectedProduct(product);
            setUploadModalOpen(true);
        }
    };

    const handleUploadComplete = () => {
        // Refresh business details to get updated progress
        fetchBusinessDetails();
        fetchUploadedDocuments();
    };

    const handleDocumentDelete = async (documentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Refresh data
                fetchUploadedDocuments();
                fetchBusinessDetails();
            } else {
                console.error('Failed to delete document');
                showToast('Failed to delete document. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Error deleting document:', err);
            showToast('An error occurred while deleting the document.', 'error');
        }
    };

    const calculateMissingDocuments = () => {
        const missing: Array<{
            docName: string;
            description: string;
            productId: string;
            productName: string;
        }> = [];

        products.forEach((product) => {
            const requiredDocs = product.productId.requiredDocs.filter(d => d.isRequired);

            requiredDocs.forEach((doc) => {
                // Check if this document has been uploaded for this product
                const isUploaded = uploadedDocuments.some(
                    (uploaded) =>
                        uploaded.businessProductId === product._id &&
                        uploaded.docName === doc.docName &&
                        uploaded.status !== 'rejected' // Rejected docs are missing
                );

                if (!isUploaded) {
                    missing.push({
                        docName: doc.docName,
                        description: doc.description || 'No description available',
                        productId: product._id,
                        productName: product.productId.productName,
                    });
                }
            });
        });

        setMissingDocuments(missing);
    };

    const scrollToProduct = (productId: string) => {
        const element = productRefs.current[productId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            }, 2000);

            // Open the document upload modal for this product
            const product = products.find(p => p._id === productId);
            if (product) {
                setTimeout(() => {
                    setSelectedProduct(product);
                    setUploadModalOpen(true);
                }, 500); // Small delay to let scroll complete
            }
        }
    };

    const fetchUploadedDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/documents/business/${businessId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Combine required docs and acknowledgements with categories
                const userDocs = (data.documents?.requiredDocs || []).map((d: any) => ({ ...d, category: 'user_upload' }));
                const ackDocs = (data.documents?.acknowledgements || []).map((d: any) => ({ ...d, category: 'acknowledgement' }));
                setUploadedDocuments([...userDocs, ...ackDocs]);
            }
        } catch (err) {
            console.error('Failed to fetch uploaded documents:', err);
            showToast('Failed to fetch uploaded documents', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <SettingsPanel />
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-surface rounded w-1/3"></div>
                        <div className="h-64 bg-surface rounded"></div>
                    </div>
                </div>
            </div>
        );
    }



    if (!business) return null;

    return (
        <div className="min-h-screen bg-background p-8">
            <SettingsPanel />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-muted hover:text-foreground mb-2 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-foreground">{business.businessName}</h1>
                        <p className="mt-1 text-muted">{business.entityType} • {business.compLocation}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${business.isActive ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted'
                        }`}>
                        {business.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Payment Pending Alert - Only show when business is inactive */}
                {!business.isActive && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Payment Pending</h3>
                                <p className="text-sm text-yellow-700 mb-3">
                                    Your business setup is incomplete. Complete the payment to activate your business and access all features.
                                </p>
                                <button
                                    onClick={() => router.push(`/businesses/${businessId}/checkout`)}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors"
                                >
                                    Complete Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Business Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-surface border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Business Information</h2>
                                <button
                                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                                    className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                                >
                                    {showMoreInfo ? 'Less Info' : 'More Info'}
                                    <svg
                                        className={`w-4 h-4 transition-transform ${showMoreInfo ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted">Description</p>
                                    <p className="text-foreground">{business.businessDescription}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted">Entity Type</p>
                                        <p className="text-foreground font-medium">{business.entityType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted">Formation State</p>
                                        <p className="text-foreground font-medium">{business.compLocation}</p>
                                    </div>
                                </div>
                                {business.ein && (
                                    <div>
                                        <p className="text-sm text-muted">EIN</p>
                                        <p className="text-foreground font-medium">{business.ein}</p>
                                    </div>
                                )}
                            </div>
                            {showMoreInfo && <BusinessDetailsExpanded business={business} />}
                        </div>

                        {/* Products with Progress */}
                        <div className="bg-surface border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Active Services</h2>
                                <button
                                    onClick={() => router.push(`/businesses/${businessId}/checkout`)}
                                    className="text-sm text-primary hover:text-primary-hover font-medium"
                                >
                                    Add More
                                </button>
                            </div>
                            {products.length > 0 ? (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div
                                            key={product._id}
                                            ref={(el) => { productRefs.current[product._id] = el; }}
                                            className="transition-all duration-300"
                                        >
                                            <ProductProgressCard
                                                product={product}
                                                uploadedDocuments={uploadedDocuments}
                                                businessId={businessId}
                                                onDocumentUpload={handleDocumentUpload}
                                                onDocumentDelete={handleDocumentDelete}
                                                onBusinessInfoUpdate={fetchBusinessDetails}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted mb-4">No products added yet</p>
                                    <button
                                        onClick={() => router.push(`/businesses/${businessId}/checkout`)}
                                        className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Add Products
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recommended Products */}
                        {recommendedProducts.length > 0 && (
                            <div className="bg-surface border border-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
                                    <span className="text-xs text-muted">Based on your business type</span>
                                </div>
                                <div className="space-y-3">
                                    {recommendedProducts.map((product) => (
                                        <div key={product._id} className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-foreground">{product.productName}</h3>
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                                                            {product.processType}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted mt-1">{product.description}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                                                        <span>⏱️ {product.timeToComplete} days</span>
                                                        <span>📍 {product.departmentType}</span>
                                                    </div>
                                                    {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-xs font-medium text-foreground mb-1">What's Included:</p>
                                                            <ul className="text-xs text-muted space-y-1">
                                                                {product.whatsIncluded.slice(0, 3).map((item, idx) => (
                                                                    <li key={idx}>✓ {item.title}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4 flex flex-col items-end">
                                                    <div className="text-right mb-3">
                                                        <p className="text-2xl font-bold text-foreground">${product.price}</p>
                                                        <p className="text-xs text-muted">one-time</p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/businesses/${businessId}/checkout?productId=${product._id}`)}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Required Documents */}
                        <div className="bg-surface border border-border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Required Documents</h2>
                            {missingDocuments.length > 0 ? (
                                <div className="space-y-3">
                                    {missingDocuments.map((doc, index) => (
                                        <div
                                            key={index}
                                            onClick={() => scrollToProduct(doc.productId)}
                                            className="border border-border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-foreground">{doc.docName}</p>
                                                    <p className="text-xs text-muted mt-1">{doc.description}</p>
                                                    <p className="text-xs text-primary mt-2 font-medium">For: {doc.productName}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-muted flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <svg className="w-12 h-12 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium text-foreground">All documents uploaded!</p>
                                    <p className="text-xs text-muted mt-1">You're all set</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {/* Actions */}
                        <div className="bg-surface border border-border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Actions</h2>
                            <div className="space-y-2">
                                {/* View Documents Dropdown */}
                                <div>
                                    <button
                                        onClick={() => setActiveAction(activeAction === 'documents' ? null : 'documents')}
                                        className="w-full px-4 py-2 rounded-lg text-left text-foreground hover:bg-background transition-colors flex items-center justify-between border border-border"
                                    >
                                        <span>View Documents</span>
                                        <svg className={`w-5 h-5 transition-transform ${activeAction === 'documents' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {activeAction === 'documents' && (
                                        <div className="mt-2 pl-4 space-y-2 border-l-2 border-border ml-2">
                                            {uploadedDocuments.filter(d => d.category === 'user_upload').length > 0 ? (
                                                uploadedDocuments
                                                    .filter(d => d.category === 'user_upload')
                                                    .map((doc, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                                                            <div className="flex-1 min-w-0 mr-2">
                                                                <p className="font-medium text-foreground truncate">{doc.docName}</p>
                                                                <span className={`text-xs px-1.5 py-0.5 rounded ${doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                                    doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {doc.status}
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={doc.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:text-primary-hover p-1"
                                                                title="View Document"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-sm text-muted italic p-2">No documents uploaded yet</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Download Reports Dropdown */}
                                <div>
                                    <button
                                        onClick={() => setActiveAction(activeAction === 'reports' ? null : 'reports')}
                                        className="w-full px-4 py-2 rounded-lg text-left text-foreground hover:bg-background transition-colors flex items-center justify-between border border-border"
                                    >
                                        <span>Download Reports</span>
                                        <svg className={`w-5 h-5 transition-transform ${activeAction === 'reports' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {activeAction === 'reports' && (
                                        <div className="mt-2 pl-4 space-y-2 border-l-2 border-border ml-2">
                                            {uploadedDocuments.filter(d => d.category === 'acknowledgement').length > 0 ? (
                                                uploadedDocuments
                                                    .filter(d => d.category === 'acknowledgement')
                                                    .map((doc, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                                                            <div className="flex-1 min-w-0 mr-2">
                                                                <p className="font-medium text-foreground truncate">{doc.docName}</p>
                                                                <p className="text-xs text-muted truncate">For: {doc?.productId?.productName}</p>
                                                            </div>
                                                            <a
                                                                href={doc.fileUrl}
                                                                download
                                                                className="text-primary hover:text-primary-hover p-1"
                                                                title="Download Report"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-sm text-muted italic p-2">No reports available yet</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Upload Modal */}
            {selectedProduct && (
                <DocumentUpload
                    isOpen={uploadModalOpen}
                    onClose={() => {
                        setUploadModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    businessProductId={selectedProduct._id}
                    productId={selectedProduct.productId._id}
                    businessId={businessId}
                    requiredDocs={selectedProduct.productId.requiredDocs.filter(d => {
                        if (!d.isRequired) return false;
                        const uploadedDoc = uploadedDocuments.find(
                            ud => ud.businessProductId === selectedProduct._id &&
                                ud.docName === d.docName
                        );
                        // Show if not uploaded or if uploaded but rejected
                        return !uploadedDoc || uploadedDoc.status === 'rejected';
                    })}
                    onUploadComplete={handleUploadComplete}
                />
            )}
        </div>
    );
}
