export interface Founder {
    name: string;
    phone: string;
    email: string;
    country: string;
    ownershipPercentage?: number;
    role?: string;
    citizenship?: string;
    residencyStatus?: 'US' | 'NON_US';
    itin?: {
        assigned: boolean;
        number?: string;
    };
    visitedUSForBusiness?: boolean;
    visitDetails?: any;
    compensationMethod?: 'SALARY' | 'DIVIDENDS' | 'BOTH';
    w8Provided?: boolean;
}


export interface RegisteredAgent {
    name: string;
    address: string;
    isActive: boolean;
}

export interface ProductDetail {
    _id: string;
    businessId: string;
    productId: {
        _id: string;
        productName: string;
        description: string;
        price: number;
        processType: 'expedite' | 'standard';
        departmentType: string;
        timeToComplete: number;
        requiredDocs: Array<{
            docName: string;
            docType: string;
            category: 'requiredDoc' | 'acknowledgement';
            description?: string;
            isRequired: boolean;
        }>;
        requiredBusinessFields?: Array<{
            fieldName: string;
            label: string;
            fieldType: 'text' | 'email' | 'phone' | 'date' | 'select';
            isRequired: boolean;
            options?: string[];
            description?: string;
        }>;
    };
    userId: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed' | 'cancelled' | 'pending';
    purchasePrice: number;
    notes?: string;
    progress: number; // 0, 50, or 100
    completedSteps: string[]; // e.g., ['start', 'payment', 'documentation']
    createdAt: string;
    updatedAt: string;
}

export interface Business {
    _id: string;
    userId: string;
    legalName?: string;
    businessName: string;
    businessDescription: string;
    entityType: 'LLC' | 'C-Corp' | 'S-Corp' | 'Partnership' | 'Sole Proprietorship';
    compLocation: string;
    founderStructure: 'solo' | 'multi';
    founderInfo: Founder[];
    regAgentInfo: RegisteredAgent[];
    products?: string[];
    productDetails?: ProductDetail[];
    recommendedProduct?: Array<{ productId: string | any }>;
    requiredDocuments?: {
        name: string;
        status: 'pending' | 'uploaded' | 'verified';
        url?: string;
    }[];
    ein?: string;
    taxId?: string;
    registrationDate?: string;
    isActive: boolean;
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    website?: string;
    natureOfBusiness?: string;
    boirFiled?: boolean;
    incorporationContext?: 'SUBSIDIARY' | 'STANDALONE' | 'HOLDING';
    parentCompany?: {
        name: string;
        country: string;
    };
    fundraisingEnabled?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBusinessRequest {
    businessName: string;
    businessDescription: string;
    entityType: 'LLC' | 'C-Corp' | 'S-Corp' | 'Partnership' | 'Sole Proprietorship';
    compLocation: string;
    founderStructure: 'solo' | 'multi';
    founderInfo: Founder[];
    regAgentInfo?: RegisteredAgent[];
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    website?: string;
    alreadyRegistered?: boolean;
}
