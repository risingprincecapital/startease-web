'use client';

import { ProductDetail } from '@/types/business';
import { useState, useEffect } from 'react';
import { environment } from '@/app/utils/env';
import DocumentPreview from './DocumentPreview';
import BusinessInfoWizard from './BusinessInfoWizard';
import { RequiredBusinessField } from '@/types/product';
import { useToast } from '@/app/contexts/ToastContext';

interface ProductProgressCardProps {
    product: ProductDetail;
    uploadedDocuments?: any[];
    businessId: string;
    onDocumentUpload?: (productId: string) => void;
    onDocumentDelete?: (documentId: string) => void;
    onBusinessInfoUpdate?: () => void;
}

export default function ProductProgressCard({ product, uploadedDocuments = [], businessId, onDocumentUpload, onDocumentDelete, onBusinessInfoUpdate }: ProductProgressCardProps) {
    const [showDocuments, setShowDocuments] = useState(true);
    const [missingFields, setMissingFields] = useState<RequiredBusinessField[]>([]);
    const [showWizard, setShowWizard] = useState(false);
    const [loadingFields, setLoadingFields] = useState(false);
    const { showToast } = useToast();

    const progressPercentage = product.progress;
    const lastStep = product.completedSteps[product.completedSteps.length - 1];
    const showUploadSection = lastStep === 'payment' && product.status === 'active';

    const getProgressColor = () => {
        if (progressPercentage === 100) return 'bg-green-500';
        if (progressPercentage === 75) return 'bg-teal-300';
        if (progressPercentage === 50) return 'bg-yellow-500';
        return 'bg-gray-300';
    };

    const getStatusBadge = () => {
        const colors = {
            active: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[product.status] || colors.pending;
    };

    const calculateDaysRemaining = () => {
        if (product.status === 'completed') {
            return 'Completed';
        }

        const startDate = new Date(product.startDate);
        const today = new Date();
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = product.productId.timeToComplete - daysPassed;

        if (daysRemaining < 0) {
            return 'Overdue';
        }

        return `${daysRemaining} days remaining`;
    };

    // Fetch missing business fields
    useEffect(() => {
        const fetchMissingFields = async () => {
            if (!product.productId.requiredBusinessFields || product.productId.requiredBusinessFields.length === 0) {
                return;
            }

            setLoadingFields(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${environment.API_URL}/businesses/${businessId}/missing-fields/${product.productId._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setMissingFields(data.missingFields || []);
                }
            } catch (error) {
                console.error('Failed to fetch missing fields:', error);
                showToast('Failed to fetch missing fields', 'error');
            } finally {
                setLoadingFields(false);
            }
        };

        fetchMissingFields();
    }, [businessId, product.productId._id, product.productId.requiredBusinessFields]);

    const handleWizardComplete = () => {
        setMissingFields([]);
        onBusinessInfoUpdate?.();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            {/* Product Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {product.productId.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {product.productId.description}
                    </p>
                </div>
                <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-900">
                        ${product.purchasePrice.toFixed(2)}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusBadge()}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Progress Steps:</p>
                <div className="flex flex-wrap gap-2">
                    {['start', 'payment', 'documentation', 'acknowledgement'].map((step, index) => {
                        const isCompleted = product.completedSteps.includes(step);
                        return (
                            <span
                                key={index}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isCompleted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                    <span className="font-medium">Process Type:</span> {product.productId.processType}
                </div>
                <div>
                    <span className="font-medium">Time Remaining:</span> {calculateDaysRemaining()}
                </div>
                <div>
                    <span className="font-medium">Department:</span> {product.productId.departmentType}
                </div>
                <div>
                    <span className="font-medium">Purchase Date:</span> {new Date(product.startDate).toLocaleDateString()}
                </div>
            </div>

            {/* Document Upload Section */}
            {showUploadSection && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Time Calculation Note */}
                    <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Time will be calculated once the correct document is provided.
                        </p>
                    </div>

                    {/* Calculate pending and uploaded documents */}
                    {(() => {
                        const requiredDocs = product.productId.requiredDocs.filter(doc => doc.isRequired);

                        const pendingDocs = requiredDocs.filter(doc => {
                            const uploadedDoc = uploadedDocuments.find(
                                ud => ud.docName === doc.docName && ud.businessProductId === product._id
                            );
                            // If not uploaded, or if uploaded but rejected, it's pending
                            return !uploadedDoc || uploadedDoc.status === 'rejected';
                        });

                        const completedDocs = uploadedDocuments.filter(
                            ud => ud.businessProductId === product._id && ud.category === 'requiredDoc' && ud.status !== 'rejected'
                        );

                        return (
                            <>
                                {/* Toggle Button */}
                                <button
                                    onClick={() => setShowDocuments(!showDocuments)}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <span className="text-sm font-medium text-gray-900">
                                        Documents
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform ${showDocuments ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDocuments && (
                                    <div className="mt-4 space-y-6">
                                        {/* Required (Pending) Documents */}
                                        {pendingDocs.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                                    Required Documents ({pendingDocs.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {pendingDocs.map((doc, index) => {
                                                        const uploadedDoc = uploadedDocuments.find(
                                                            ud => ud.docName === doc.docName && ud.businessProductId === product._id
                                                        );
                                                        const isRejected = uploadedDoc?.status === 'rejected';

                                                        return (
                                                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm text-gray-900">{doc.docName}</p>
                                                                        {doc.description && (
                                                                            <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                                                        )}
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            Accepted: {doc.docType}
                                                                        </p>
                                                                        {isRejected && (
                                                                            <p className="text-xs text-red-600 mt-2 font-medium">
                                                                                ⚠️ Rejected. Please upload again.
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => onDocumentUpload?.(product._id)}
                                                                        className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                                                    >
                                                                        {isRejected ? 'Re-upload' : 'Upload'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Uploaded Documents */}
                                        {completedDocs.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                                    Uploaded Documents ({completedDocs.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {completedDocs.map((doc, index) => (
                                                        <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                                                            <DocumentPreview
                                                                docName={doc.docName}
                                                                fileUrl={doc.fileUrl || doc.file}
                                                                docType={doc.docType}
                                                                uploadTime={doc.uploadTime}
                                                                status={doc.status}
                                                                onDelete={onDocumentDelete ? () => onDocumentDelete(doc._id) : undefined}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pendingDocs.length === 0 && completedDocs.length === 0 && (
                                            <p className="text-sm text-gray-500 italic">No documents required.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Information Required Section */}
            {missingFields.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Information Required</h4>
                        <span className="text-xs text-gray-500">
                            {missingFields.length} field{missingFields.length > 1 ? 's' : ''} needed
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                        Additional business information is required to proceed with this service.
                    </p>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                        Provide Information
                    </button>
                </div>
            )}

            {/* Business Info Wizard */}
            <BusinessInfoWizard
                isOpen={showWizard}
                onClose={() => setShowWizard(false)}
                businessId={businessId}
                missingFields={missingFields}
                onComplete={handleWizardComplete}
            />
        </div>
    );
}
