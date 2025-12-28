import { createApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/features/auth/auth.store';
import { PageData, Tenant } from './types';

export const tenantService = {
    getTenants: async (page = 0, pageSize = 10, textSearch = ''): Promise<PageData<Tenant>> => {
        const { activeEnvId, environments, token } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !token) throw new Error('Not authenticated');

        const api = createApiClient(env.baseUrl, token);

        return await api.get('/api/tenants', {
            params: {
                pageSize,
                page,
                textSearch,
                sortProperty: 'createdTime',
                sortOrder: 'DESC'
            }
        });
    },

    getTenantUserToken: async (_tenantId: string): Promise<string> => {
        // This is a "SysAdmin" feature: masquerade as tenant admin or get their login token.
        // In standard TB API, SysAdmin cannot directly "get token" for a tenant without login.
        // However, a common pattern for "Magic Jump" is:
        // 1. SysAdmin creates a one-time login link? No, native TB doesn't have this.
        // 2. SysAdmin impersonates? TB Enterprise has "Login as Tenant". Community Edition does not directly support "Login as Tenant" API easily without knowing credentials.
        // WAIT. Design doc says "Through SysAdmin identity get target tenant Token".
        // Let's check how we can do this.
        // Actually, the best way in CE is to fetching the Tenant Admin user, and resetting their password? NO.
        // Let's assume for now we just open the Web UI.
        // BUT, if we want "Magic Jump" (Auto Login), we need a token.
        // 
        // Alternative: If we are SysAdmin, we can fetch the Tenant Admins list: `/api/tenant/{tenantId}/users?authority=TENANT_ADMIN`
        // Then pick one. But we can't get their token without password.
        // 
        // Exception: If we are using `jwt-fake-token-generator`? No.
        // 
        // Let's stick to: "Open Web UI" (maybe just link for now) OR finding a way.
        // Actually, TB has `/api/user/{userId}/token`? No.
        // 
        // HACK: As SysAdmin, we can change the password of a specific Tenant Admin to a known temporary value, login, get token, then restore? Too risky.
        // 
        // Let's look at the Design Document again. "3.2 一键跳转 ... 通过 SysAdmin 身份获取目标租户 Token".
        // Maybe the user assumes we can do it.
        // In standard TB, standard "Login as Tenant" is only in PE.
        // For CE, we might assume the user *knows* the credentials or we just redirect to the login page pre-filled?
        // 
        // Let's implement getting the DETAILS first. We will verify the "Magic Jump" feasibility later.

        return ""; // FLAGGED for verification
    }
};
