import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tenantService } from './tenant.service';

export const useTenants = (page = 0, pageSize = 20, textSearch = '') => {
    return useQuery({
        queryKey: ['tenants', page, pageSize, textSearch],
        queryFn: () => tenantService.getTenants(page, pageSize, textSearch),
        placeholderData: keepPreviousData,
    });
};
