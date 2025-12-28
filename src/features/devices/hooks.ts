import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { deviceService } from './device.service';

export const useDevices = (page = 0, pageSize = 20, textSearch = '', type = '') => {
    return useQuery({
        queryKey: ['devices', page, pageSize, textSearch, type],
        queryFn: () => deviceService.getTenantDevices(page, pageSize, textSearch, type),
        placeholderData: keepPreviousData,
    });
};

export const useDeviceCredentials = (deviceId: string | null) => {
    return useQuery({
        queryKey: ['device', deviceId, 'credentials'],
        queryFn: () => deviceId ? deviceService.getDeviceCredentials(deviceId) : null,
        enabled: !!deviceId
    });
};
