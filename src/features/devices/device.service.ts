import { createApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/features/auth/auth.store';
import { PageData } from '@/features/tenant/types';
import { DeviceInfo } from './types';

export const deviceService = {
    getTenantDevices: async (page = 0, pageSize = 50, textSearch = '', type = ''): Promise<PageData<DeviceInfo>> => {
        const { activeEnvId, environments, token } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !token) throw new Error('Not authenticated');
        const api = createApiClient(env.baseUrl, token);

        const params: any = {
            pageSize,
            page,
            textSearch,
            sortProperty: 'createdTime',
            sortOrder: 'DESC'
        };

        if (type) {
            params.type = type;
        }

        return await api.get('/api/tenant/deviceInfos', { params });
    },

    // Get specific device credentials (if sysadmin/tenant admin)
    getDeviceCredentials: async (deviceId: string) => {
        const { activeEnvId, environments, token } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !token) throw new Error('Not authenticated');
        const api = createApiClient(env.baseUrl, token);

        return await api.get(`/api/device/${deviceId}/credentials`);
    }
};
