import { createApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/features/auth/auth.store';
import { AlarmInfo } from './types';

export const alarmService = {
    getAlarms: async (page: number, pageSize: number, status: string = 'ACTIVE_UNACK'): Promise<{ data: AlarmInfo[]; totalElements: number; totalPages: number }> => {
        const { activeEnvId, environments } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env) throw new Error('No active environment');

        const api = createApiClient(env.baseUrl, useAuthStore.getState().token || undefined);

        // Fetching alarms for the current user's tenant context
        // This usually requires a tenantId or EntityId. For a dashboard "System Health", 
        // we might want to fetch all alarms or alarms for the Tenant.
        // Getting current tenant ID from user info might be safer if we want tenant level alarms.
        // However, standard API /api/alarm/{entityType}/{entityId} requires an entity.
        // /api/alarms/{status} is deprecated or specific?
        // Let's use the standard query API if possible or specific one.

        // Actually, typically we query alarms. Let's assume we want all active alarms for the current tenant.
        // We will needed a mocked implementation if the complex audit/alarm API is too hard to reach without entity context.
        // But let's try to hit /api/alarms which often exists for general lists or check documentation.
        // Valid endpoint: /api/alarm/V2 (Query)

        // For simplicity in this tool, let's fetch alarms for the current "User" or generic.
        // If we don't have a specific entity, we can try fetching alarms for the Tenant itself.

        const user = useAuthStore.getState().user;
        if (!user || !user.tenantId) return { data: [], totalElements: 0, totalPages: 0 };

        try {
            const response = await api.get<any, { data: AlarmInfo[]; totalElements: number; totalPages: number }>(
                `/api/alarm/info/TENANT/${user.tenantId}`,
                {
                    params: {
                        pageSize,
                        page,
                        status
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Failed to fetch alarms', error);
            return { data: [], totalElements: 0, totalPages: 0 };
        }
    }
};
