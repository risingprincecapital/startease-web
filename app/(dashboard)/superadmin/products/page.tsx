'use client';

import { useState, useEffect } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/contexts/ToastContext';

interface Product {
    _id: string;
    productName: string;
    description: string;
    price: number;
    processType: string;
    departmentType: string;
    timeToComplete: number;
    productType: string;
    isActive: boolean;
    createdAt: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products);
            } else {
                showToast(data.error || 'Failed to fetch products', 'error');
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
            const response = await fetch(`${environment.API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setProducts(products.filter(p => p._id !== id));
                showToast('Product deleted successfully', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to delete product', 'error');
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
                <h1 className="text-2xl font-bold text-foreground">Products</h1>
                <Link
                    href="/superadmin/products/create"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
                >
                    Create Product
                </Link>
            </div>



            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                                    No products found. Create your first product!
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{product.productName}</div>
                                        <div className="text-sm text-muted truncate max-w-md">{product.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground">${product.price}</td>
                                    <td className="px-6 py-4 text-sm text-foreground capitalize">{product.processType}</td>
                                    <td className="px-6 py-4 text-sm text-foreground">{product.departmentType}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-2">
                                        <Link
                                            href={`/superadmin/products/${product._id}`}
                                            className="text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id, product.productName)}
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
