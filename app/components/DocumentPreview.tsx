'use client';

import { useState } from 'react';

interface DocumentPreviewProps {
    docName: string;
    fileUrl: string;
    docType: string;
    uploadTime: string;
    status: string;
    onDownload?: () => void;
    onDelete?: () => void;
    allowDeleteVerified?: boolean;
}

export default function DocumentPreview({
    docName,
    fileUrl,
    docType,
    uploadTime,
    status,
    onDownload,
    onDelete,
    allowDeleteVerified = false,
}: DocumentPreviewProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusColor = () => {
        const colors = {
            uploaded: 'bg-blue-100 text-blue-800',
            verified: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || colors.pending;
    };

    const getFileIcon = () => {
        const type = docType.toUpperCase();
        if (type === 'PDF') {
            return (
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
            );
        } else if (['JPG', 'JPEG', 'PNG'].includes(type)) {
            return (
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            // Default download behavior
            window.open(fileUrl, '_blank');
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
    };

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete();
        }
        setIsDeleting(false);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(false);
    };

    const renderPreview = () => {
        const type = docType.toUpperCase();

        if (['JPG', 'JPEG', 'PNG'].includes(type)) {
            return (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <img
                        src={fileUrl}
                        alt={docName}
                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                </div>
            );
        } else if (type === 'PDF') {
            return (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                        src={fileUrl}
                        className="w-full h-96"
                        title={docName}
                    />
                </div>
            );
        } else {
            return (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Preview not available for this file type</p>
                    <button
                        onClick={handleDownload}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Download to view
                    </button>
                </div>
            );
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    {getFileIcon()}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                            {docName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(uploadTime).toLocaleDateString()} • {docType.toUpperCase()}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title="Preview"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title="Download"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    {/* only to delete documents */}
                    {onDelete && (status !== 'verified' || allowDeleteVerified) && (
                        isDeleting ? (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleConfirmDelete}
                                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                    title="Confirm Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                    title="Cancel"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleDeleteClick}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )
                    )} 
                </div>
            </div>

            {showPreview && renderPreview()}
        </div>
    );
}
