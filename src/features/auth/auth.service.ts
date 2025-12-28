import { createApiClient } from '@/lib/api-client';
import { useAuthStore } from './auth.store';
import { LoginResponse, User, TokenPair } from './types';
import { jwtDecode } from 'jwt-decode'; // We might need this to parse User Info from token if the API doesn't return it

export const authService = {
    login: async (username: string, password: string): Promise<User> => {
        const { activeEnvId, environments, setTokens, setUser } = useAuthStore.getState();

        const env = environments.find(e => e.id === activeEnvId);
        if (!env) {
            throw new Error('No active environment selected');
        }

        const api = createApiClient(env.baseUrl);

        // ThingsBoard Login API
        const response = await api.post<any, LoginResponse>('/api/auth/login', {
            username,
            password
        });

        const { token, refreshToken } = response;
        setTokens({ token, refreshToken });

        // Parse User from Token
        const decoded: any = jwtDecode(token);
        const user: User = {
            sub: decoded.sub,
            scopes: decoded.scopes,
            userId: decoded.userId,
            authority: decoded.scopes[0], // simplified
            tenantId: decoded.tenantId,
            customerId: decoded.customerId,
            enabled: decoded.enabled,
            isPublic: decoded.isPublic
        };

        setUser(user);
        return user;
    },

    impersonateTenant: async (tenantId: string): Promise<{ user: User; token: string }> => {
        const { activeEnvId, environments, token: adminToken, impersonate } = useAuthStore.getState();
        const env = environments.find(e => e.id === activeEnvId);
        if (!env || !adminToken) throw new Error('Unauthorized or environment not selected');

        const api = createApiClient(env.baseUrl, adminToken);

        // 1. Get tenant admin users
        const usersResponse = await api.get<any, { data: any[] }>(`/api/tenant/${tenantId}/users`, {
            params: { pageSize: 1, page: 0 }
        });

        if (!usersResponse.data || usersResponse.data.length === 0) {
            throw new Error('No admin users found for this tenant');
        }

        const targetUser = usersResponse.data[0];

        // 2. Get token for this user (Sysadmin only)
        const tokenResponse = await api.get<any, TokenPair>(`/api/user/${targetUser.id.id}/token`);

        const token = tokenResponse.token;
        const decoded: any = jwtDecode(token);
        const user: User = {
            sub: decoded.sub,
            scopes: decoded.scopes,
            userId: decoded.userId,
            authority: decoded.scopes[0],
            tenantId: decoded.tenantId,
            customerId: decoded.customerId,
            enabled: decoded.enabled,
            isPublic: decoded.isPublic
        };

        // 3. Update Store
        impersonate(user, token);

        return { user, token };
    }
};
