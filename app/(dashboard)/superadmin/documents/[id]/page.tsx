'use client';

import { useState, useEffect } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/app/contexts/ToastContext';

interface RequiredDocument {
    _id: string;
    docName: string;
    description: string;
    docType: string;
    isRequired: boolean;
}

export default function EditDocumentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        docName: '',
        description: '',
        docType: 'PDF',
        isRequired: true,
    });

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({
                    docName: data.document.docName,
                    description: data.document.description,
                    docType: data.document.docType,
                    isRequired: data.document.isRequired,
                });
            } else {
                showToast(data.error || 'Failed to fetch document', 'error');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update document');
            }

            showToast('Document updated successfully!', 'success');
            setTimeout(() => router.push('/superadmin/documents'), 1500);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
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
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Edit Document</h1>

            <div className="bg-surface border border-border rounded-lg p-6">

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Document Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.docName}
                            onChange={(e) => setFormData({ ...formData, docName: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Document Type
                            </label>
                            <select
                                value={formData.docType}
                                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {['PDF', 'JPEG', 'JPG', 'PNG', 'DOCX', 'DOC', 'XLSX', 'XLS', 'TXT'].map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isRequired}
                                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">Is Required?</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/superadmin/documents')}
                            className="px-4 py-2 border border-border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
