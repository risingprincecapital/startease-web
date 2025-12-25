'use client';

import { useState } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter } from 'next/navigation';
import { CreateBusinessRequest, Founder } from '@/types/business';
import PhoneInput from '@/app/components/PhoneInput';
import SearchableSelect from '@/app/components/SearchableSelect';
import SettingsPanel from '@/app/components/SettingsPanel';
import { US_STATES, ENTITY_TYPES } from '@/lib/constants';
import { useToast } from '@/app/contexts/ToastContext';

export default function NewBusinessPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState<CreateBusinessRequest>({
        businessName: '',
        businessDescription: '',
        entityType: 'LLC',
        compLocation: '',
        founderStructure: 'solo',
        founderInfo: [{
            name: '',
            phone: '',
            email: '',
            country: 'USA',
            ownershipPercentage: 100,
        }],
        regAgentInfo: [],
    });

    const updateFormData = (updates: Partial<CreateBusinessRequest>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const addFounder = () => {
        const currentFounders = formData.founderInfo.length;
        const newOwnership = Math.floor(100 / (currentFounders + 1));

        setFormData(prev => ({
            ...prev,
            founderInfo: [
                ...prev.founderInfo.map(f => ({ ...f, ownershipPercentage: newOwnership })),
                {
                    name: '',
                    phone: '',
                    email: '',
                    country: 'USA',
                    ownershipPercentage: newOwnership,
                }
            ]
        }));
    };

    const removeFounder = (index: number) => {
        if (formData.founderInfo.length <= 1) return;

        const newFounders = formData.founderInfo.filter((_, i) => i !== index);
        const newOwnership = Math.floor(100 / newFounders.length);

        setFormData(prev => ({
            ...prev,
            founderInfo: newFounders.map(f => ({ ...f, ownershipPercentage: newOwnership }))
        }));
    };

    const updateFounder = (index: number, updates: Partial<Founder>) => {
        ;
        setFormData(prev => ({
            ...prev,
            founderInfo: prev.founderInfo.map((f, i) => i === index ? { ...f, ...updates } : f)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        formData.founderInfo.forEach(f => {
            if (f.phone) {
                f.phone = f.phone.replace(/\s/g, '');
            }
        });
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/businesses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create business');
            }

            // Redirect to checkout page for first-time setup
            router.push(`/businesses/${data.business._id}/checkout`);
        } catch (err: any) {
            showToast(err.message || 'Failed to create business', 'error');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <SettingsPanel />
            <div className="max-w-3xl mx-auto">
                {/* Enhanced Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className="relative">
                                    {/* Step Circle with Filling Effect */}
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-lg relative overflow-hidden transition-all duration-500 ${s < step ? 'bg-primary text-white scale-110' :
                                        s === step ? 'bg-primary text-white scale-125 shadow-lg shadow-primary/50' :
                                            'bg-surface text-muted border-2 border-border'
                                        }`}>
                                        {/* Filling animation for completed steps */}
                                        {s < step && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary-hover to-primary animate-pulse" />
                                        )}
                                        <span className="relative z-10">{s}</span>
                                    </div>
                                </div>
                                {s < 3 && (
                                    <div className="relative mx-4">
                                        {/* Centered connecting bar with gradient fill */}
                                        <div className="h-1 w-32 bg-border rounded-full overflow-hidden">
                                            <div className={`h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-700 ${s < step ? 'w-full' : 'w-0'
                                                }`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-38 text-sm font-medium">
                        <span className={step >= 1 ? 'text-primary' : 'text-muted'}>Basic</span>
                        <span className={step >= 2 ? 'text-primary ml-2' : 'text-muted ml-2'}>Founders</span>
                        <span className={step >= 3 ? 'text-primary' : 'text-muted'}>Review</span>
                    </div>
                </div>



                {/* Step 1: Business Basics */}
                {step === 1 && (
                    <div className="bg-surface border border-border rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Business Basics</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateFormData({ businessName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="My Awesome Company"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Business Description *
                                </label>
                                <textarea
                                    value={formData.businessDescription}
                                    onChange={(e) => updateFormData({ businessDescription: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={4}
                                    placeholder="Describe what your business does..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Entity Type *
                                </label>
                                <SearchableSelect
                                    value={formData.entityType}
                                    onChange={(value) => updateFormData({ entityType: value as any })}
                                    options={ENTITY_TYPES}
                                    placeholder="Select entity type"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Formation State *
                                </label>
                                <SearchableSelect
                                    value={formData.compLocation}
                                    onChange={(value) => updateFormData({ compLocation: value })}
                                    options={US_STATES.map(state => ({ value: state, label: state }))}
                                    placeholder="Select a state"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={!formData.businessName || !formData.businessDescription || !formData.compLocation}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Founder Information */}
                {step === 2 && (
                    <div className="bg-surface border border-border rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Founder Information</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Founder Structure *
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.founderStructure === 'solo'}
                                        onChange={() => {
                                            updateFormData({
                                                founderStructure: 'solo',
                                                founderInfo: [{
                                                    ...formData.founderInfo[0],
                                                    ownershipPercentage: 100
                                                }]
                                            });
                                        }}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-foreground">Solo Founder</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.founderStructure === 'multi'}
                                        onChange={() => updateFormData({ founderStructure: 'multi' })}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-foreground">Multiple Founders</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {formData.founderInfo.map((founder, index) => (
                                <div key={index} className="border border-border rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-foreground">Founder {index + 1}</h3>
                                        {formData.founderStructure === 'multi' && formData.founderInfo.length > 1 && (
                                            <button
                                                onClick={() => removeFounder(index)}
                                                className="text-destructive hover:text-destructive/80 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={founder.name}
                                                    onChange={(e) => updateFounder(index, { name: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={founder.email}
                                                    onChange={(e) => updateFounder(index, { email: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Phone *
                                            </label>
                                            <PhoneInput
                                                value={founder.phone}
                                                onChange={(value) => updateFounder(index, { phone: value })}
                                                required
                                            />
                                        </div>

                                        {formData.founderStructure === 'multi' && (
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Ownership %
                                                </label>
                                                <input
                                                    type="number"
                                                    value={founder.ownershipPercentage}
                                                    onChange={(e) => updateFounder(index, { ownershipPercentage: Number(e.target.value) })}
                                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {formData.founderStructure === 'multi' && (
                                <button
                                    onClick={addFounder}
                                    className="w-full border-2 border-dashed border-border rounded-lg py-4 text-muted hover:text-foreground hover:border-primary transition-colors"
                                >
                                    + Add Another Founder
                                </button>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-lg font-semibold text-foreground hover:bg-background transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!formData.founderInfo.every(f => f.name && f.email && f.phone)}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <div className="bg-surface border border-border rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Review & Submit</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Business Information</h3>
                                <div className="bg-background rounded-lg p-4 space-y-2">
                                    <p><span className="text-muted">Name:</span> <span className="text-foreground font-medium">{formData.businessName}</span></p>
                                    <p><span className="text-muted">Type:</span> <span className="text-foreground font-medium">{formData.entityType}</span></p>
                                    <p><span className="text-muted">State:</span> <span className="text-foreground font-medium">{formData.compLocation}</span></p>
                                    <p><span className="text-muted">Description:</span> <span className="text-foreground">{formData.businessDescription}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Founders</h3>
                                <div className="bg-background rounded-lg p-4 space-y-3">
                                    {formData.founderInfo.map((founder, index) => (
                                        <div key={index} className="border-b border-border last:border-0 pb-3 last:pb-0">
                                            <p className="font-medium text-foreground">{founder.name}</p>
                                            <p className="text-sm text-muted">{founder.email} • {founder.phone}</p>
                                            {formData.founderStructure === 'multi' && (
                                                <p className="text-sm text-muted">Ownership: {founder.ownershipPercentage}%</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-lg font-semibold text-foreground hover:bg-background transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Business'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
