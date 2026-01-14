'use client';

import { useState } from 'react';
import { environment } from '@/app/utils/env';
import { useToast } from '@/app/contexts/ToastContext';

interface DocumentUploadProps {
    isOpen: boolean;
    onClose: () => void;
    businessProductId: string;
    productId: string;
    businessId: string;
    requiredDocs: Array<{
        docName: string;
        docType: string;
        category: 'requiredDoc' | 'acknowledgement';
        description?: string;
        isRequired: boolean;
    }>;
    onUploadComplete?: () => void;
}

export default function DocumentUpload({
    isOpen,
    onClose,
    businessProductId,
    productId,
    businessId,
    requiredDocs,
    onUploadComplete,
}: DocumentUploadProps) {
    const [selectedDoc, setSelectedDoc] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showToast('Please select a file', 'error');
            return;
        }

        setUploading(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64File = reader.result as string;
                const doc = requiredDocs[selectedDoc];

                const response = await fetch(`${environment.API_URL}/documents`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        businessId,
                        productId,
                        businessProductId,
                        docName: doc.docName,
                        file: base64File,
                        docType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
                        category: 'requiredDoc',
                        description: doc.description,
                        isRequired: doc.isRequired,
                        fileSize: file.size,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                // Reset form
                setFile(null);
                setSelectedDoc(0);
                onUploadComplete?.();
                // Move to next document or close if all done
                if (selectedDoc < requiredDocs.length - 1) {
                    setSelectedDoc(selectedDoc + 1);
                } else {
                    onClose();
                }
                showToast('Document uploaded successfully', 'success');
                onClose();
                // close modal
            };

            reader.onerror = () => {
                showToast('Failed to read file', 'error');
                setUploading(false);
            };
        } catch (err) {
            showToast('Upload failed. Please try again.', 'error');
            setUploading(false);
        }
    };

    const currentDoc = requiredDocs[selectedDoc];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Upload Required Documents</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Indicator */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Document {selectedDoc + 1} of {requiredDocs.length}
                        </span>
                        <span className="text-sm text-gray-500">
                            {Math.round(((selectedDoc) / requiredDocs.length) * 100)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((selectedDoc) / requiredDocs.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {currentDoc.docName}
                        </h3>
                        {currentDoc.description && (
                            <p className="text-sm text-gray-600 mb-4">{currentDoc.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                            Accepted file types: {currentDoc.docType}
                        </p>
                    </div>

                    {/* File Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select File
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>



                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4">
                        <button
                            onClick={() => setSelectedDoc(Math.max(0, selectedDoc - 1))}
                            disabled={selectedDoc === 0}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading ? 'Uploading...' : 'Upload & Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
