'use client';

import { useEffect, useState } from 'react';
import { environment } from '@/app/utils/env';
import { useRouter, useParams } from 'next/navigation';
import { Product } from '@/types/product';
import SettingsPanel from '@/app/components/SettingsPanel';
import { useToast } from '@/app/contexts/ToastContext';

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params.id as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const { showToast } = useToast();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch business details to get purchased products
            const businessResponse = await fetch(`${environment.API_URL}/businesses/${businessId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let purchasedProductIds: string[] = [];
            if (businessResponse.ok) {
                const businessData = await businessResponse.json();
                // Get IDs of already purchased products
                purchasedProductIds = (businessData.business.productDetails || []).map((pd: any) => pd.productId._id);
            }

            // Fetch recommended products
            const response = await fetch(`${environment.API_URL}/businesses/${businessId}/recommended-products`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const recommendedList: Product[] = data.recommendedProducts || [];

                // Filter out already purchased products (additional safety check)
                const availableProducts = recommendedList.filter(
                    p => !purchasedProductIds.includes(p._id)
                );

                // Mark them as recommended for UI styling
                const productsWithFlag = availableProducts.map(p => ({
                    ...p,
                    recommendedProduct: true
                }));

                setProducts(productsWithFlag);

                // Pre-select all recommended products
                const recommendedIds = new Set<string>(productsWithFlag.map(p => p._id));
                setSelectedProducts(recommendedIds);
            } else {
                throw new Error('Failed to fetch recommended products');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const calculateTotal = () => {
        return products
            .filter(p => selectedProducts.has(p._id))
            .reduce((sum, p) => sum + p.price, 0);
    };

    const handleCheckout = async () => {
        if (selectedProducts.size === 0) {
            showToast('Please select at least one product', 'error');
            return;
        }

        setProcessingPayment(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.API_URL}/payments/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    businessId,
                    productIds: Array.from(selectedProducts),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe checkout
            window.location.href = data.url;
        } catch (err: any) {
            showToast(err.message || 'Failed to process payment', 'error');
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <SettingsPanel />
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-surface rounded w-1/3"></div>
                        <div className="h-64 bg-surface rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <SettingsPanel />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Checkout Services</h1>
                    <p className="mt-2 text-muted">Select the services you need for your business</p>
                </div>

                {/* Products List */}
                <div className="space-y-4 mb-8">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className={`bg-surface border-2 rounded-lg p-6 transition-all cursor-pointer ${selectedProducts.has(product._id)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                                }`}
                            onClick={() => toggleProduct(product._id)}
                        >
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.has(product._id)}
                                        onChange={() => toggleProduct(product._id)}
                                        className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                {product.productName}
                                                {product.recommendedProduct && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                                                        Recommended
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted">{product.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-foreground">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    {product.priceBreakup && (
                                        <div className="mt-4 p-4 bg-background rounded-lg">
                                            <h4 className="text-sm font-semibold text-foreground mb-2">Price Breakdown</h4>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted">StartEase Fee</span>
                                                    <span className="text-foreground font-medium">
                                                        ${product.priceBreakup.starteaseFee.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted">State Fee</span>
                                                    <span className="text-foreground font-medium">
                                                        ${product.priceBreakup.stdFee.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* What's Included */}
                                    {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-foreground mb-2">What's Included</h4>
                                            <ul className="space-y-1">
                                                {product.whatsIncluded.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-muted">
                                                        <svg
                                                            className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span>{item.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total and Checkout */}
                <div className="bg-surface border border-border rounded-lg p-6 sticky bottom-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted">Total Amount</p>
                            <p className="text-3xl font-bold text-foreground">
                                ${calculateTotal().toFixed(2)} <span className="text-lg text-muted">USD</span>
                            </p>
                            <p className="text-xs text-muted mt-1">
                                {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-6 py-3 rounded-lg font-semibold text-foreground hover:bg-background transition-colors"
                                disabled={processingPayment}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={selectedProducts.size === 0 || processingPayment}
                                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Payment
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
