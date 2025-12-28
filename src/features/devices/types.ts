export interface DeviceId {
    id: string;
    entityType: 'DEVICE';
}

export interface Device {
    id: DeviceId;
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
    deviceProfileId?: {
        id: string;
        entityType: 'DEVICE_PROFILE';
    };
    deviceData?: {
        configuration: any;
        transportConfiguration: any;
    };
    additionalInfo?: any;
    // Client-side fields for visualization
    active?: boolean;
}
export interface DeviceInfo extends Device {
    customerTitle?: string;
    deviceProfileName?: string;
    active?: boolean;
}
