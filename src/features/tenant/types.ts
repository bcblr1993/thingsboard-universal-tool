export interface Tenant {
    id: {
        id: string;
        entityType: 'TENANT';
    };
    createdTime: number;
    title: string;
    email: string;
    region: string;
    country?: string;
    city?: string;
    state?: string;
    zip?: string;
    address?: string;
    phone?: string;
    additionalInfo?: any;
}

export interface PageData<T> {
    data: T[];
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
}
