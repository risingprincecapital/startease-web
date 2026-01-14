'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SettingsPanel from '@/app/components/SettingsPanel';
import DocumentPreview from '@/app/components/DocumentPreview';
import { User } from '@/types/user';
import BusinessDetailsExpanded from '@/app/components/BusinessDetailsExpanded';
import { useToast } from '@/app/contexts/ToastContext';
import { environment } from '@/app/utils/env';

interface Business {
    _id: string;
    businessName: string;
    businessDescription: string;
    entityType: string;
    compLocation: string;
    founderStructure: string;
    founderInfo: any[];
    isActive: boolean;
    ein?: string;
    userId: {
        _id: string;
        email: string;
        name?: string;
    };
    products?: any[];
    recommendedProduct?: any[];
}

interface Product {
    _id: string;
    productName: string;
    price: number;
    description: string;
}

interface Document {
    _id: string;
    docName: string;
    fileUrl: string;
    docType: string;
    uploadTime: string;
    status: string;
    category: string;
    productId: any;
    businessProductId: any;
    description?: string;
}

export default function AdminBusinessDetailPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params.id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [documents, setDocuments] = useState<any[]>([]); // Grouped by product
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { showToast } = useToast();
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    // Recommended products
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');

    // Document verification
    const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isVerifyingDocId, setIsVerifyingDocId] = useState<string | null>(null);
    const [isRejectingDocId, setIsRejectingDocId] = useState<string | null>(null);

    // Missing business fields
    const [missingFieldsData, setMissingFieldsData] = useState<any>(null);
    const [loadingMissingFields, setLoadingMissingFields] = useState(false);

    // Acknowledgement upload
    const [uploadingAckForProductId, setUploadingAckForProductId] = useState<string | null>(null);
    const [ackFile, setAckFile] = useState<string | null>(null);
    const [ackDescription, setAckDescription] = useState('');
    const [isSubmittingAck, setIsSubmittingAck] = useState(false);
    const [isDeletingDocId, setIsDeletingDocId] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);

            if (!userData.isAdmin) {
                router.push('/dashboard');
                return;
            }
        } else {
            router.push('/login');
            return;
        }

        fetchData();
    }, [businessId]);

    const fetchData = async () => {
        await Promise.all([
            fetchBusinessDetails(),
            fetchAllProducts(),
            fetchDocuments(),
            fetchMissingFields()
        ]);
        setLoading(false);
    };

    const fetchBusinessDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/businesses/${businessId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setBusiness(data.business);
                setEditForm(data.business);
            } else {
                throw new Error('Failed to fetch business');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
            setError(err.message);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setAllProducts(data.products || []);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            showToast('Failed to fetch products', 'error');
        }
    };

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/documents/business/${businessId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documentsByProduct || []);
            }
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            showToast('Failed to fetch documents', 'error');
        }
    };

    const fetchMissingFields = async () => {
        try {
            setLoadingMissingFields(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/businesses/${businessId}/missing-fields`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setMissingFieldsData(data);
            }
        } catch (err) {
            console.error('Failed to fetch missing fields:', err);
            showToast('Failed to fetch missing fields', 'error');
        } finally {
            setLoadingMissingFields(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/businesses/${businessId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    businessName: editForm.businessName,
                    businessDescription: editForm.businessDescription,
                    entityType: editForm.entityType,
                    compLocation: editForm.compLocation,
                    ein: editForm.ein,
                    businessAddress: editForm.businessAddress,
                    businessPhone: editForm.businessPhone,
                    businessEmail: editForm.businessEmail,
                    website: editForm.website,
                    incorporationContext: editForm.incorporationContext,
                    fundraisingEnabled: editForm.fundraisingEnabled,
                    founderInfo: editForm.founderInfo,
                }),
            });

            if (response.ok) {
                await fetchBusinessDetails();
                setIsEditing(false);
                showToast('Business updated successfully!', 'success');
            } else {
                throw new Error('Failed to update business');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to update business', 'error');
        }
    };

    const handleAddRecommendedProduct = async () => {
        if (!selectedProductId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/businesses/${businessId}/recommended-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: selectedProductId }),
            });

            if (response.ok) {
                await fetchBusinessDetails();
                setShowAddProduct(false);
                setSelectedProductId('');
                showToast('Product added to recommendations!', 'success');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add product');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        }
    };

    const handleRemoveRecommendedProduct = async (productId: string) => {
        if (!confirm('Remove this product from recommendations?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/businesses/${businessId}/recommended-products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                await fetchBusinessDetails();
                showToast('Product removed from recommendations!', 'success');
            } else {
                throw new Error('Failed to remove product');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        }
    };

    const handleVerifyDocument = async (docId: string) => {
        if (!confirm('Verify this document? This will update the business product progress to 75%.')) return;

        try {
            setIsVerifyingDocId(docId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/documents/${docId}/verify`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                await fetchDocuments();
                // Also refresh business details to get updated progress
                await fetchBusinessDetails();
                showToast('Document verified successfully!', 'success');
            } else {
                throw new Error('Failed to verify document');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsVerifyingDocId(null);
        }
    };

    const handleRejectDocument = async (docId: string) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            setIsRejectingDocId(docId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/documents/${docId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (response.ok) {
                await fetchDocuments();
                setRejectingDocId(null);
                setRejectionReason('');
                showToast('Document rejected!', 'success');
            } else {
                throw new Error('Failed to reject document');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsRejectingDocId(null);
        }
    };

    const handleAcknowledgementUpload = async (productId: string, businessProductId: string) => {
        if (!ackFile) {
            alert('Please upload a file');
            return;
        }

        try {
            setIsSubmittingAck(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/documents/acknowledgement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    businessId,
                    productId,
                    businessProductId,
                    docName: 'Acknowledgement',
                    file: ackFile,
                    description: ackDescription || 'Acknowledgement document',
                }),
            });

            if (response.ok) {
                await fetchDocuments();
                await fetchBusinessDetails();
                setUploadingAckForProductId(null);
                setAckFile(null);
                setAckDescription('');
                showToast('Acknowledgement uploaded! Business product marked as 100% complete.', 'success');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to upload acknowledgement');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsSubmittingAck(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        try {
            setIsDeletingDocId(docId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/documents/${docId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                await fetchDocuments();
                showToast('Document deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete document');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsDeletingDocId(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setAckFile(reader.result as string);
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <SettingsPanel />
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-surface rounded w-1/3"></div>
                        <div className="h-64 bg-surface rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen bg-background p-8">
                <SettingsPanel />
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-600">
                        {error || 'Business not found'}
                    </div>
                </div>
            </div>
        );
    }

    const purchasedProductIds = business.products?.map(p => p.productId._id || p.productId) || [];
    const recommendedProductIds = business.recommendedProduct?.map(rp => rp.productId._id || rp.productId) || [];
    const availableProducts = allProducts.filter(
        p => !purchasedProductIds.includes(p._id) && !recommendedProductIds.includes(p._id)
    );

    return (
        <div className="min-h-screen bg-background p-8">
            <SettingsPanel />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-primary hover:text-primary-hover mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">{business.businessName}</h1>
                </div>

                {/* Business Information */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">Business Information</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm(business);
                                    }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:opacity-90"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setShowMoreInfo(!showMoreInfo)}
                            className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 ml-4"
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

                    {isEditing ? (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        value={editForm.businessName || ''}
                                        onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-1">Entity Type</label>
                                    <select
                                        value={editForm.entityType || ''}
                                        onChange={(e) => setEditForm({ ...editForm, entityType: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    >
                                        <option value="LLC">LLC</option>
                                        <option value="C-Corp">C-Corp</option>
                                        <option value="S-Corp">S-Corp</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-1">Formation State</label>
                                    <input
                                        type="text"
                                        value={editForm.compLocation || ''}
                                        onChange={(e) => setEditForm({ ...editForm, compLocation: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-1">EIN</label>
                                    <input
                                        type="text"
                                        value={editForm.ein || ''}
                                        onChange={(e) => setEditForm({ ...editForm, ein: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-muted mb-1">Description</label>
                                    <textarea
                                        value={editForm.businessDescription || ''}
                                        onChange={(e) => setEditForm({ ...editForm, businessDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-muted mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={editForm.businessAddress || ''}
                                            onChange={(e) => setEditForm({ ...editForm, businessAddress: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.businessPhone || ''}
                                            onChange={(e) => setEditForm({ ...editForm, businessPhone: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted mb-1">Email</label>
                                        <input
                                            type="text"
                                            value={editForm.businessEmail || ''}
                                            onChange={(e) => setEditForm({ ...editForm, businessEmail: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted mb-1">Website</label>
                                        <input
                                            type="text"
                                            value={editForm.website || ''}
                                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Corporate Structure */}
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Corporate Structure</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-muted mb-1">Incorporation Context</label>
                                        <select
                                            value={editForm.incorporationContext || ''}
                                            onChange={(e) => setEditForm({ ...editForm, incorporationContext: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                                        >
                                            <option value="">Select...</option>
                                            <option value="SUBSIDIARY">Subsidiary</option>
                                            <option value="STANDALONE">Standalone</option>
                                            <option value="HOLDING">Holding</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <input
                                            type="checkbox"
                                            checked={editForm.fundraisingEnabled || false}
                                            onChange={(e) => setEditForm({ ...editForm, fundraisingEnabled: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-foreground">Fundraising Enabled</label>
                                    </div>
                                </div>
                            </div>

                            {/* Founders */}
                            <div className="border-t border-border pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-foreground">Founders</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newFounders = [...(editForm.founderInfo || [])];
                                            newFounders.push({
                                                name: '',
                                                email: '',
                                                phone: '',
                                                role: '',
                                                citizenship: '',
                                                residencyStatus: '',
                                                compensationMethod: '',
                                                ownershipPercentage: '',
                                                visitedUSForBusiness: false,
                                                w8Provided: false
                                            });
                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                        }}
                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Founder
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {editForm.founderInfo?.map((founder: any, index: number) => (
                                        <div key={index} className="bg-background border border-border rounded p-4 space-y-3 relative group">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-muted">Founder {index + 1}</h4>
                                                {editForm.founderInfo.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFounders = editForm.founderInfo.filter((_: any, i: number) => i !== index);
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove Founder"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={founder.name || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].name = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Email</label>
                                                    <input
                                                        type="text"
                                                        value={founder.email || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].email = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={founder.phone || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].phone = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Role</label>
                                                    <input
                                                        type="text"
                                                        value={founder.role || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].role = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Citizenship</label>
                                                    <input
                                                        type="text"
                                                        value={founder.citizenship || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].citizenship = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Residency Status</label>
                                                    <select
                                                        value={founder.residencyStatus || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].residencyStatus = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="US">US</option>
                                                        <option value="NON_US">Non-US</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Compensation Method</label>
                                                    <select
                                                        value={founder.compensationMethod || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].compensationMethod = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="SALARY">Salary</option>
                                                        <option value="DIVIDENDS">Dividends</option>
                                                        <option value="BOTH">Both</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-muted mb-1">Ownership %</label>
                                                    <input
                                                        type="number"
                                                        value={founder.ownershipPercentage || ''}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].ownershipPercentage = e.target.value;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        placeholder="0"
                                                        className="w-full px-2 py-1 rounded border border-border bg-surface text-foreground text-sm"
                                                    />
                                                </div>
                                                <div className="flex items-center mt-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={founder.visitedUSForBusiness || false}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].visitedUSForBusiness = e.target.checked;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    <label className="text-xs text-foreground">Visited US for Business</label>
                                                </div>
                                                <div className="flex items-center mt-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={founder.w8Provided || false}
                                                        onChange={(e) => {
                                                            const newFounders = [...editForm.founderInfo];
                                                            newFounders[index].w8Provided = e.target.checked;
                                                            setEditForm({ ...editForm, founderInfo: newFounders });
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    <label className="text-xs text-foreground">W8 Provided</label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted">Business Name</p>
                                <p className="text-foreground font-medium">{business.businessName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted">Entity Type</p>
                                <p className="text-foreground font-medium">{business.entityType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted">Formation State</p>
                                <p className="text-foreground font-medium">{business.compLocation}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${business.isActive ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                                    }`}>
                                    {business.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            {business.ein && (
                                <div>
                                    <p className="text-sm text-muted">EIN</p>
                                    <p className="text-foreground font-medium">{business.ein}</p>
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted">Description</p>
                                <p className="text-foreground">{business.businessDescription}</p>
                            </div>
                        </div>
                    )}
                    {showMoreInfo && business && <BusinessDetailsExpanded business={business as any} />}
                </div>

                {/* Owner Information */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Owner Information</h2>
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm text-muted">Email</p>
                            <p className="text-foreground font-medium">{business.userId.email}</p>
                        </div>
                        {business.userId.name && (
                            <div>
                                <p className="text-sm text-muted">Name</p>
                                <p className="text-foreground font-medium">{business.userId.name}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Missing Business Information Status */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Required Business Information Status</h2>

                    {loadingMissingFields ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-background rounded w-3/4"></div>
                            <div className="h-4 bg-background rounded w-1/2"></div>
                        </div>
                    ) : missingFieldsData && missingFieldsData.hasMissingFields ? (
                        <div className="space-y-4">
                            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-semibold text-yellow-600 mb-1">Additional Information Required</p>
                                        <p className="text-sm text-yellow-700">
                                            {missingFieldsData.totalMissingCount} field{missingFieldsData.totalMissingCount !== 1 ? 's' : ''} required across {missingFieldsData.productsWithMissingFields.length} product{missingFieldsData.productsWithMissingFields.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Products with missing fields */}
                            <div className="space-y-3">
                                {missingFieldsData.productsWithMissingFields.map((product: any) => (
                                    <div key={product.productId} className="bg-background border border-border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-foreground">{product.productName}</h3>
                                            <span className="text-sm text-muted">
                                                {product.missingCount} of {product.totalRequired} fields missing
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {product.missingFields.map((field: any, idx: number) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <div>
                                                        <p className="font-medium text-foreground">{field.label}</p>
                                                        {field.description && (
                                                            <p className="text-muted text-xs">{field.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : missingFieldsData ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-green-600 font-medium">All required business information has been provided</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted text-sm">No products with required business fields</p>
                    )}
                </div>

                {/* Purchased Products & Documents */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Purchased Products</h2>

                    {business.products && business.products.length > 0 ? (
                        <div className="space-y-6">
                            {business.products.map((bp: any) => {
                                const productId = bp.productId._id || bp.productId;
                                const productDocs = documents.find(d => d.product._id === productId)?.documents || [];
                                const isAckUploading = uploadingAckForProductId === productId;

                                return (
                                    <div key={productId} className="border border-border rounded-lg p-4">
                                        {/* Product Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg">{bp.productId.productName}</h3>
                                                <p className="text-sm text-muted">${bp.productId.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground mb-1">
                                                    Status: <span className="capitalize">{bp.status}</span>
                                                </div>
                                                <div className="text-sm text-muted">
                                                    Progress: {bp.progress}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Uploaded Documents */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Uploaded Documents</h4>
                                            {productDocs.filter((d: Document) => d.category !== 'acknowledgement').length > 0 ? (
                                                <div className="space-y-3">
                                                    {productDocs
                                                        .filter((d: Document) => d.category !== 'acknowledgement')
                                                        .map((doc: Document) => (
                                                            <div key={doc._id} className="bg-background border border-border rounded-lg p-4 relative">
                                                                <DocumentPreview
                                                                    docName={doc.docName}
                                                                    fileUrl={doc.fileUrl}
                                                                    docType={doc.docType}
                                                                    uploadTime={doc.uploadTime}
                                                                    status={doc.status}
                                                                />

                                                                {doc.status === 'uploaded' && doc.category === 'requiredDoc' && (
                                                                    <div className="mt-3 flex gap-2">
                                                                        <button
                                                                            onClick={() => handleVerifyDocument(doc._id)}
                                                                            disabled={isVerifyingDocId === doc._id || isRejectingDocId === doc._id}
                                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                                                        >
                                                                            {isVerifyingDocId === doc._id ? (
                                                                                <>
                                                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                    </svg>
                                                                                    Verifying...
                                                                                </>
                                                                            ) : (
                                                                                'Verify Document'
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setRejectingDocId(doc._id)}
                                                                            disabled={isVerifyingDocId === doc._id || isRejectingDocId === doc._id}
                                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {rejectingDocId === doc._id && (
                                                                    <div className="mt-3 space-y-2">
                                                                        <textarea
                                                                            value={rejectionReason}
                                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                                            placeholder="Reason for rejection..."
                                                                            rows={2}
                                                                            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleRejectDocument(doc._id)}
                                                                                disabled={isRejectingDocId === doc._id}
                                                                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                                                            >
                                                                                {isRejectingDocId === doc._id ? (
                                                                                    <>
                                                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                        </svg>
                                                                                        Rejecting...
                                                                                    </>
                                                                                ) : (
                                                                                    'Confirm Reject'
                                                                                )}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setRejectingDocId(null);
                                                                                    setRejectionReason('');
                                                                                }}
                                                                                disabled={isRejectingDocId === doc._id}
                                                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted italic">No documents uploaded by user yet.</p>
                                            )}
                                        </div>

                                        {/* Acknowledgement Section */}
                                        <div className="border-t border-border pt-4">
                                            <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Acknowledgements</h4>

                                            {/* List of existing acknowledgements */}
                                            {productDocs.filter((d: Document) => d.category === 'acknowledgement').length > 0 && (
                                                <div className="space-y-3 mb-4">
                                                    {productDocs
                                                        .filter((d: Document) => d.category === 'acknowledgement')
                                                        .map((doc: Document) => (
                                                            <div key={doc._id} className="bg-background border border-border rounded-lg p-3 relative group/ack">
                                                                <DocumentPreview
                                                                    docName={doc.docName}
                                                                    fileUrl={doc.fileUrl}
                                                                    docType={doc.docType}
                                                                    uploadTime={doc.uploadTime}
                                                                    status={doc.status}
                                                                    onDelete={() => handleDeleteDocument(doc._id)}
                                                                    allowDeleteVerified={true}
                                                                />
                                                                {isDeletingDocId === doc._id && (
                                                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                                                                        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}

                                            {/* Upload Section */}
                                            <div>
                                                {!isAckUploading ? (
                                                    <button
                                                        onClick={() => setUploadingAckForProductId(productId)}
                                                        className="px-4 py-2 bg-accent text-foreground rounded-lg font-semibold hover:opacity-90 text-sm"
                                                    >
                                                        {productDocs.some((d: Document) => d.category === 'acknowledgement')
                                                            ? 'Upload Additional Acknowledgement'
                                                            : 'Upload Acknowledgement'}
                                                    </button>
                                                ) : (
                                                    <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                                                        <div>
                                                            <label className="block text-sm text-muted mb-1">Upload PDF</label>
                                                            <input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={handleFileChange}
                                                                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm text-muted mb-1">Description (Optional)</label>
                                                            <input
                                                                type="text"
                                                                value={ackDescription}
                                                                onChange={(e) => setAckDescription(e.target.value)}
                                                                placeholder="Acknowledgement description"
                                                                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAcknowledgementUpload(productId, bp._id)}
                                                                disabled={!ackFile || isSubmittingAck}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 text-sm flex items-center gap-2"
                                                            >
                                                                {isSubmittingAck ? (
                                                                    <>
                                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Uploading...
                                                                    </>
                                                                ) : (
                                                                    'Upload'
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setUploadingAckForProductId(null);
                                                                    setAckFile(null);
                                                                    setAckDescription('');
                                                                }}
                                                                disabled={isSubmittingAck}
                                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:opacity-90 text-sm disabled:opacity-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted text-sm">No products purchased yet.</p>
                    )}
                </div>

                {/* Recommended Products */}
                <div className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">Recommended Products</h2>
                        <button
                            onClick={() => setShowAddProduct(!showAddProduct)}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
                        >
                            {showAddProduct ? 'Cancel' : 'Add Product'}
                        </button>
                    </div>

                    {showAddProduct && (
                        <div className="mb-4 p-4 bg-background border border-border rounded-lg">
                            <select
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground mb-2"
                            >
                                <option value="">Select a product...</option>
                                {availableProducts.map(product => (
                                    <option key={product._id} value={product._id}>
                                        {product.productName} - ${product.price}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddRecommendedProduct}
                                disabled={!selectedProductId}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                                Add to Recommendations
                            </button>
                        </div>
                    )}

                    {business.recommendedProduct && business.recommendedProduct.length > 0 ? (
                        <div className="space-y-2">
                            {business.recommendedProduct.map((rp: any) => (
                                <div key={rp.productId._id || rp.productId} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">{rp.productId.productName}</p>
                                        <p className="text-sm text-muted">${rp.productId.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveRecommendedProduct(rp.productId._id || rp.productId)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:opacity-90"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-sm">No recommended products</p>
                    )}
                </div>
            </div>
        </div>
    );
}
