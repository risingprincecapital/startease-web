'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export default function SuperAdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'Super Admin'}</h2>
                <p className="text-muted">
                    You have full access to manage products and document requirements.
                    Use the sidebar to navigate to different sections.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Create Product</h3>
                    <p className="text-muted mb-4">Add new products to the catalog with pricing and requirements.</p>
                    <a href="/superadmin/products/create" className="text-primary hover:underline font-medium">
                        Go to Create Product &rarr;
                    </a>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Create Document Requirement</h3>
                    <p className="text-muted mb-4">Define new document types that can be required for products.</p>
                    <a href="/superadmin/documents/create" className="text-primary hover:underline font-medium">
                        Go to Create Document &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}
