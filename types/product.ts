export interface PriceBreakup {
    starteaseFee: number;
    stdFee: number;
}

export interface WhatsIncluded {
    title: string;
    description: string;
}

export interface RequiredBusinessField {
    fieldName: string;
    label: string;
    fieldType: 'text' | 'email' | 'phone' | 'date' | 'select';
    isRequired: boolean;
    options?: string[];
    description?: string;
}

export interface Product {
    _id: string;
    productName: string;
    description: string;
    price: number;
    processType: 'expedite' | 'standard';
    departmentType: string;
    timeToComplete: number;
    productType: 'recurring' | 'onetime';
    priceBreakup: PriceBreakup;
    whatsIncluded: WhatsIncluded[];
    requiredBusinessFields?: RequiredBusinessField[];
    category?: string;
    subCategory?: string;
    isActive: boolean;
    recommendedProduct?: boolean; // UI only field
    createdAt: string;
    updatedAt: string;
}

export interface CheckoutSession {
    sessionId: string;
    url: string;
}

export interface PaymentStatus {
    status: 'success' | 'cancelled' | 'pending';
    sessionId?: string;
    businessId?: string;
    productIds?: string[];
}

export interface CreateCheckoutRequest {
    businessId: string;
    productIds: string[];
}
