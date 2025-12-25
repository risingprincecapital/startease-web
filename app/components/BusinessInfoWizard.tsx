'use client';

import { useState } from 'react';
import { RequiredBusinessField } from '@/types/product';
import { useToast } from '@/app/contexts/ToastContext';
import { environment } from '@/app/utils/env';

interface BusinessInfoWizardProps {
    isOpen: boolean;
    onClose: () => void;
    businessId: string;
    missingFields: RequiredBusinessField[];
    onComplete?: () => void;
}

export default function BusinessInfoWizard({
    isOpen,
    onClose,
    businessId,
    missingFields,
    onComplete,
}: BusinessInfoWizardProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleChange = (fieldName: string, value: any) => {
        // Handle array-indexed nested fields like founderInfo[0].citizenship
        if (fieldName.includes('[')) {
            const match = fieldName.match(/^(\w+)\[(\d+)\]\.(.+)$/);
            if (match) {
                const [, arrayName, index, nestedField] = match;
                const idx = parseInt(index);
                setFormData(prev => {
                    const array = prev[arrayName] || [];
                    const updatedArray = [...array];
                    if (!updatedArray[idx]) updatedArray[idx] = {};

                    // Handle deeply nested fields like itin.number
                    if (nestedField.includes('.')) {
                        const [parent, child] = nestedField.split('.');
                        updatedArray[idx] = {
                            ...updatedArray[idx],
                            [parent]: {
                                ...(updatedArray[idx][parent] || {}),
                                [child]: value,
                            },
                        };
                    } else {
                        updatedArray[idx] = { ...updatedArray[idx], [nestedField]: value };
                    }

                    return { ...prev, [arrayName]: updatedArray };
                });
                return;
            }
        }

        // Handle nested fields like parentCompany.name
        if (fieldName.includes('.')) {
            const [parent, child] = fieldName.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent] || {}),
                    [child]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [fieldName]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        const missingRequired = missingFields.filter(
            field => field.isRequired && !formData[field.fieldName]
        );

        if (missingRequired.length > 0) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/businesses/${businessId}/update-info`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showToast('Business information updated successfully', 'success');
                onComplete?.();
                onClose();
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to update business information', 'error');
            }
        } catch (err) {
            showToast('An error occurred while updating information', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field: RequiredBusinessField) => {
        // Handle array-indexed nested field values like founderInfo[0].citizenship
        let value = formData[field.fieldName] || '';

        if (field.fieldName.includes('[')) {
            const match = field.fieldName.match(/^(\w+)\[(\d+)\]\.(.+)$/);
            if (match) {
                const [, arrayName, index, nestedField] = match;
                const idx = parseInt(index);
                const array = formData[arrayName] || [];
                if (array[idx]) {
                    // Handle deeply nested like itin.number
                    if (nestedField.includes('.')) {
                        const [parent, child] = nestedField.split('.');
                        value = array[idx][parent]?.[child] || '';
                    } else {
                        value = array[idx][nestedField] || '';
                    }
                }
            }
        } else if (field.fieldName.includes('.')) {
            const [parent, child] = field.fieldName.split('.');
            value = formData[parent]?.[child] || '';
        }

        // Define options for select fields
        let selectOptions: string[] = [];
        if (field.fieldType === 'select') {
            if (field.fieldName === 'boirFiled') {
                selectOptions = ['Yes', 'No'];
            } else if (field.fieldName === 'incorporationContext') {
                selectOptions = ['SUBSIDIARY', 'STANDALONE', 'HOLDING'];
            } else if (field.fieldName === 'fundraisingEnabled') {
                selectOptions = ['Yes', 'No'];
            } else if (field.fieldName === 'founderStructure') {
                selectOptions = ['solo', 'multi'];
            } else if (field.fieldName.includes('residencyStatus')) {
                selectOptions = ['US', 'NON_US'];
            } else if (field.fieldName.includes('itin.assigned') || field.fieldName.includes('visitedUSForBusiness') || field.fieldName.includes('w8Provided')) {
                selectOptions = ['Yes', 'No'];
            } else if (field.fieldName.includes('compensationMethod')) {
                selectOptions = ['SALARY', 'DIVIDENDS', 'BOTH'];
            } else if (field.options) {
                selectOptions = field.options;
            }
        }

        switch (field.fieldType) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => {
                            let val: any = e.target.value;
                            // Convert Yes/No to boolean for boolean fields
                            if (field.fieldName === 'boirFiled' || field.fieldName === 'fundraisingEnabled') {
                                val = val === 'Yes';
                            }
                            handleChange(field.fieldName, val);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required={field.isRequired}
                    >
                        <option value="">Select {field.label}</option>
                        {selectOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => handleChange(field.fieldName, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required={field.isRequired}
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        value={value}
                        onChange={(e) => handleChange(field.fieldName, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.isRequired}
                    />
                );
            case 'phone':
                return (
                    <input
                        type="tel"
                        value={value}
                        onChange={(e) => handleChange(field.fieldName, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.isRequired}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(field.fieldName, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.isRequired}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground">Additional Information Required</h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-sm text-muted mb-6">
                        Please provide the following information to proceed with this service.
                    </p>

                    <div className="space-y-4">
                        {missingFields.map((field) => (
                            <div key={field.fieldName}>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    {field.label}
                                    {field.isRequired && <span className="text-destructive ml-1">*</span>}
                                </label>
                                {field.description && (
                                    <p className="text-xs text-muted mb-2">{field.description}</p>
                                )}
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
