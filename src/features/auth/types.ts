export interface User {
    sub: string; // Email
    scopes: string[];
    userId: string;
    firstName?: string;
    lastName?: string;
    enabled: boolean;
    tenantId: string;
    customerId: string;
    isPublic: boolean;
    authority: 'SYS_ADMIN' | 'TENANT_ADMIN' | 'CUSTOMER_USER';
}

export interface TokenPair {
    token: string;
    refreshToken: string;
}

export interface Environment {
    id: string;
    name: string;
    baseUrl: string; // e.g. http://localhost:8080 or https://demo.thingsboard.io
    lastUsed?: boolean;
}

export interface LoginResponse extends TokenPair {
    user?: User; // Depending on how we parse JWT or if we fetch user info separately
}
