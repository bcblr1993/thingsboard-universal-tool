import { createApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/features/auth/auth.store';
import { PageData } from '@/features/tenant/types';
import { Asset, EntityId, EntityRelation } from './types';

export const assetService = {
    // Get ALL assets for a tenant? 
    // Usually we want a hierarchy. 
    // TB doesn't have a simple "get Tree" API. We have to build it.
    // 1. Get Top-Level Assets? Or Search?
    // Let's implement generic Asset Search first.
    getTenantAssets: async (page = 0, pageSize = 50, textSearch = ''): Promise<PageData<Asset>> => {
        const { activeEnvId, environments, token } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !token) throw new Error('Not authenticated');
        const api = createApiClient(env.baseUrl, token);

        return await api.get('/api/tenant/assets', {
            params: { page, pageSize, textSearch, sortProperty: 'createdTime', sortOrder: 'DESC' }
        });
    },

    // Get relations for a specific entity (to find children)
    // direction: FROM (downstream) or TO (upstream)
    getRelations: async (entityId: EntityId, direction: 'FROM' | 'TO' = 'FROM'): Promise<EntityRelation[]> => {
        const { activeEnvId, environments, token } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !token) throw new Error('Not authenticated');
        const api = createApiClient(env.baseUrl, token);

        return await api.get('/api/relations', {
            params: {
                [direction === 'FROM' ? 'fromId' : 'toId']: entityId.id,
                [direction === 'FROM' ? 'fromType' : 'toType']: entityId.entityType,
                relationTypeGroup: 'COMMON'
            }
        });
    },

    // Helper: Find "Contains" children
    async getChildren(parentId: string, parentType: string): Promise<EntityRelation[]> {
        const relations = await this.getRelations({ id: parentId, entityType: parentType }, 'FROM');
        return relations.filter(r => r.type === 'Contains');
    }
};
