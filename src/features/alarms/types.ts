export interface AlarmId {
    entityType: 'ALARM';
    id: string;
}

export interface Alarm {
    id: AlarmId;
    createdTime: number;
    name: string;
    type: string;
    originator: {
        entityType: string;
        id: string;
    };
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INDETERMINATE';
    status: 'ACTIVE_UNACK' | 'ACTIVE_ACK' | 'CLEARED_UNACK' | 'CLEARED_ACK';
    details: any;
}

export interface AlarmInfo extends Alarm {
    originatorName: string;
}
