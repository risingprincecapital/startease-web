'use client';

import { useState } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';

export default function CreateRequiredDocumentPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        docName: '',
        description: '',
        docType: 'PDF',
        isRequired: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create document requirement');
            }

            showToast('Document requirement created successfully!', 'success');
            setFormData({
                docName: '',
                description: '',
                docType: 'PDF',
                isRequired: true,
            });
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Create Document Requirement</h1>

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
                            placeholder="e.g., Passport"
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
                            placeholder="Describe what the user needs to upload..."
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
                                    className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">Is Required?</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Document Requirement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
