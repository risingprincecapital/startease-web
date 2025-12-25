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

interface BusinessFieldOption {
    fieldName: string;
    label: string;
    fieldType: 'text' | 'email' | 'phone' | 'date' | 'select';
    description: string;
}

interface Product {
    _id: string;
    productName: string;
    description: string;
    price: number;
    processType: string;
    departmentType: string;
    timeToComplete: number;
    productType: string;
    category: string;
    subCategory: string;
    priceBreakup: {
        starteaseFee: number;
        stdFee: number;
    };
    whatsIncluded: Array<{ title: string; description: string }>;
    requiredDocs: any[];
    requiredBusinessFields?: any[];
    isActive: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    const [availableDocs, setAvailableDocs] = useState<RequiredDocument[]>([]);

    // Available business fields that can be required
    const availableBusinessFields: BusinessFieldOption[] = [
        // Core Business Information
        { fieldName: 'legalName', label: 'Legal Name', fieldType: 'text', description: 'Official legal name of the business' },
        { fieldName: 'compLocation', label: 'Company Location (State)', fieldType: 'text', description: 'US State where company is registered' },
        { fieldName: 'natureOfBusiness', label: 'Nature of Business', fieldType: 'text', description: 'Description of business activities' },
        { fieldName: 'founderStructure', label: 'Founder Structure', fieldType: 'select', description: 'Solo or Multi-founder structure' },

        // Tax & Registration
        { fieldName: 'ein', label: 'EIN (Employer Identification Number)', fieldType: 'text', description: '9-digit federal tax ID' },
        { fieldName: 'taxId', label: 'Tax ID', fieldType: 'text', description: 'State tax identification number' },
        { fieldName: 'registrationDate', label: 'Registration Date', fieldType: 'date', description: 'Date of business registration' },
        { fieldName: 'boirFiled', label: 'BOIR Filed', fieldType: 'select', description: 'Beneficial Ownership Information Report filing status' },

        // Contact Information
        { fieldName: 'businessAddress', label: 'Business Address', fieldType: 'text', description: 'Physical business location' },
        { fieldName: 'businessPhone', label: 'Business Phone', fieldType: 'phone', description: 'Primary business contact number' },
        { fieldName: 'businessEmail', label: 'Business Email', fieldType: 'email', description: 'Primary business email address' },
        { fieldName: 'website', label: 'Website', fieldType: 'text', description: 'Company website URL' },

        // Founder Information (nested in founderInfo array)
        { fieldName: 'founderInfo[0].citizenship', label: 'Founder Citizenship', fieldType: 'text', description: 'Citizenship of primary founder' },
        { fieldName: 'founderInfo[0].residencyStatus', label: 'Founder Residency Status', fieldType: 'select', description: 'US or Non-US residency' },
        { fieldName: 'founderInfo[0].itin.assigned', label: 'ITIN Assigned', fieldType: 'select', description: 'Whether ITIN is assigned to founder' },
        { fieldName: 'founderInfo[0].itin.number', label: 'ITIN Number', fieldType: 'text', description: 'Individual Taxpayer Identification Number' },
        { fieldName: 'founderInfo[0].visitedUSForBusiness', label: 'Visited US for Business', fieldType: 'select', description: 'Whether founder has visited US for business' },
        { fieldName: 'founderInfo[0].compensationMethod', label: 'Compensation Method', fieldType: 'select', description: 'How founder will be compensated' },
        { fieldName: 'founderInfo[0].w8Provided', label: 'W8 Form Provided', fieldType: 'select', description: 'Whether W8 form has been provided' },

        // Registered Agent Information
        { fieldName: 'regAgentInfo[0].name', label: 'Registered Agent Name', fieldType: 'text', description: 'Name of registered agent' },
        { fieldName: 'regAgentInfo[0].address', label: 'Registered Agent Address', fieldType: 'text', description: 'Address of registered agent' },

        // Corporate Structure
        { fieldName: 'incorporationContext', label: 'Incorporation Context', fieldType: 'select', description: 'Type of incorporation (Subsidiary, Standalone, Holding)' },
        { fieldName: 'parentCompany.name', label: 'Parent Company Name', fieldType: 'text', description: 'Name of parent company (if applicable)' },
        { fieldName: 'parentCompany.country', label: 'Parent Company Country', fieldType: 'text', description: 'Country of parent company' },
        { fieldName: 'fundraisingEnabled', label: 'Fundraising Enabled', fieldType: 'select', description: 'Whether fundraising is enabled' },
    ];

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        processType: 'standard',
        departmentType: '',
        timeToComplete: '',
        productType: 'onetime',
        category: '',
        subCategory: '',
        priceBreakup: {
            starteaseFee: '',
            stdFee: '',
        },
        whatsIncluded: [{ title: '', description: '' }],
        requiredDocumentIds: [] as string[],
        requiredBusinessFields: [] as string[],
        isActive: true,
    });

    useEffect(() => {
        fetchProduct();
        fetchRequiredDocuments();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                const product: Product = data.product;
                setFormData({
                    productName: product.productName,
                    description: product.description,
                    price: product.price.toString(),
                    processType: product.processType,
                    departmentType: product.departmentType,
                    timeToComplete: product.timeToComplete.toString(),
                    productType: product.productType,
                    category: product.category || '',
                    subCategory: product.subCategory || '',
                    priceBreakup: {
                        starteaseFee: product.priceBreakup.starteaseFee.toString(),
                        stdFee: product.priceBreakup.stdFee.toString(),
                    },
                    whatsIncluded: product.whatsIncluded.length > 0 ? product.whatsIncluded : [{ title: '', description: '' }],
                    requiredDocumentIds: product.requiredDocs.map(doc => doc._id),
                    requiredBusinessFields: product.requiredBusinessFields?.map((field: any) => field.fieldName) || [],
                    isActive: product.isActive,
                });
            } else {
                showToast(data.error || 'Failed to fetch product', 'error');
            }
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchRequiredDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/admin/required-documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAvailableDocs(data.documents);
            }
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            showToast('Failed to fetch document templates', 'error');
        }
    };

    const handleWhatsIncludedChange = (index: number, field: 'title' | 'description', value: string) => {
        const newWhatsIncluded = [...formData.whatsIncluded];
        newWhatsIncluded[index][field] = value;
        setFormData({ ...formData, whatsIncluded: newWhatsIncluded });
    };

    const addWhatsIncluded = () => {
        setFormData({
            ...formData,
            whatsIncluded: [...formData.whatsIncluded, { title: '', description: '' }],
        });
    };

    const removeWhatsIncluded = (index: number) => {
        const newWhatsIncluded = formData.whatsIncluded.filter((_, i) => i !== index);
        setFormData({ ...formData, whatsIncluded: newWhatsIncluded });
    };

    const toggleDocument = (docId: string) => {
        const currentIds = formData.requiredDocumentIds;
        const newIds = currentIds.includes(docId)
            ? currentIds.filter(id => id !== docId)
            : [...currentIds, docId];
        setFormData({ ...formData, requiredDocumentIds: newIds });
    };

    const toggleBusinessField = (fieldName: string) => {
        const currentFields = formData.requiredBusinessFields;
        const newFields = currentFields.includes(fieldName)
            ? currentFields.filter(f => f !== fieldName)
            : [...currentFields, fieldName];
        setFormData({ ...formData, requiredBusinessFields: newFields });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const payload: any = {
                productName: formData.productName,
                description: formData.description,
                price: Number(formData.price),
                processType: formData.processType,
                departmentType: formData.departmentType,
                timeToComplete: Number(formData.timeToComplete),
                productType: formData.productType,
                category: formData.category,
                subCategory: formData.subCategory,
                priceBreakup: {
                    starteaseFee: Number(formData.priceBreakup.starteaseFee),
                    stdFee: Number(formData.priceBreakup.stdFee),
                },
                whatsIncluded: formData.whatsIncluded,
                isActive: formData.isActive,
            };

            if (formData.requiredDocumentIds.length > 0) {
                payload.requiredDocumentIds = formData.requiredDocumentIds;
            }

            // Add required business fields
            payload.requiredBusinessFields = formData.requiredBusinessFields.map(fieldName => {
                const field = availableBusinessFields.find(f => f.fieldName === fieldName);
                return {
                    fieldName: field!.fieldName,
                    label: field!.label,
                    fieldType: field!.fieldType,
                    isRequired: true,
                    description: field!.description,
                };
            });

            const response = await fetch(`${environment.API_URL}/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update product');
            }

            showToast('Product updated successfully!', 'success');
            setTimeout(() => router.push('/superadmin/products'), 1500);
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
        <div className="p-8 max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-foreground mb-6">Edit Product</h1>

            <div className="bg-surface border border-border rounded-lg p-6">

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Department Type</label>
                            <input
                                type="text"
                                required
                                value={formData.departmentType}
                                onChange={(e) => setFormData({ ...formData, departmentType: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                        />
                    </div>

                    {/* Pricing & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Total Price ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Startease Fee ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.priceBreakup.starteaseFee}
                                onChange={(e) => setFormData({ ...formData, priceBreakup: { ...formData.priceBreakup, starteaseFee: e.target.value } })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Standard Fee ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.priceBreakup.stdFee}
                                onChange={(e) => setFormData({ ...formData, priceBreakup: { ...formData.priceBreakup, stdFee: e.target.value } })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Time to Complete (Days)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.timeToComplete}
                                onChange={(e) => setFormData({ ...formData, timeToComplete: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Process Type</label>
                            <select
                                value={formData.processType}
                                onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="standard">Standard</option>
                                <option value="expedite">Expedite</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Product Type</label>
                            <select
                                value={formData.productType}
                                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="onetime">One-time</option>
                                <option value="recurring">Recurring</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Sub Category</label>
                            <input
                                type="text"
                                value={formData.subCategory}
                                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* What's Included */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">What's Included</label>
                        <div className="space-y-3">
                            {formData.whatsIncluded.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) => handleWhatsIncludedChange(index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => handleWhatsIncludedChange(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeWhatsIncluded(index)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addWhatsIncluded}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                + Add Item
                            </button>
                        </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Update Required Documents (Optional)</label>
                        <p className="text-sm text-muted mb-2">Select documents to replace existing requirements</p>
                        <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto">
                            {availableDocs.length === 0 ? (
                                <p className="text-sm text-muted">No document templates found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {availableDocs.map((doc) => (
                                        <label key={doc._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.requiredDocumentIds.includes(doc._id)}
                                                onChange={() => toggleDocument(doc._id)}
                                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{doc.docName}</p>
                                                <p className="text-xs text-muted">{doc.docType} • {doc.isRequired ? 'Required' : 'Optional'}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Required Business Fields */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Required Business Fields</label>
                        <p className="text-xs text-muted mb-2">Select business information fields that must be provided for this product</p>
                        <div className="border border-border rounded-md p-4 max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                                {availableBusinessFields.map((field) => (
                                    <label key={field.fieldName} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.requiredBusinessFields.includes(field.fieldName)}
                                            onChange={() => toggleBusinessField(field.fieldName)}
                                            className="w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">{field.label}</p>
                                            <p className="text-xs text-muted">{field.description}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/superadmin/products')}
                            className="px-6 py-3 border border-border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
