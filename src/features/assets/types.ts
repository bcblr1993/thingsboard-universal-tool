export interface AssetId {
    id: string;
    entityType: 'ASSET';
}

export interface Asset {
    id: AssetId;
    createdTime: number;
    tenantId: {
        id: string;
        entityType: 'TENANT';
    };
    customerId: {
        id: string;
        entityType: 'CUSTOMER';
    };
    name: string;
    type: string;
    label?: string;
    additionalInfo?: any;
}

// Relation Types
export interface EntityId {
    id: string;
    entityType: string;
}

export interface EntityRelation {
    from: EntityId;
    to: EntityId;
    type: string;
    typeGroup: string;
}
