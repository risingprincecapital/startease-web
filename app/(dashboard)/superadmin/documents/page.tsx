'use client';

import { useState, useEffect } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/contexts/ToastContext';

interface RequiredDocument {
    _id: string;
    docName: string;
    description: string;
    docType: string;
    isRequired: boolean;
    createdAt: string;
}

export default function DocumentsPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<RequiredDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDocuments(data.documents);
            } else {
                showToast(data.error || 'Failed to fetch documents', 'error');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setDocuments(documents.filter(d => d._id !== id));
                showToast('Document deleted successfully', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to delete document', 'error');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Required Documents</h1>
                <Link
                    href="/superadmin/documents/create"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                >
                    Create Document
                </Link>
            </div>



            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Required</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted">
                                    No documents found. Create your first document template!
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{doc.docName}</div>
                                        <div className="text-sm text-muted truncate max-w-md">{doc.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground">{doc.docType}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${doc.isRequired
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {doc.isRequired ? 'Required' : 'Optional'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-2">
                                        <Link
                                            href={`/superadmin/documents/${doc._id}`}
                                            className="text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(doc._id, doc.docName)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
