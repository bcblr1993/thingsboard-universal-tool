import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/features/tenant/tenant.service';
import { deviceService } from '@/features/devices/device.service';
import { assetService } from '@/features/assets/asset.service';
import { alarmService } from '@/features/alarms/alarm.service';
import { adminService } from './admin.service';
import { useAuthStore } from '@/features/auth/auth.store';

export const useDashboardStats = () => {
    const user = useAuthStore(state => state.user);

    return useQuery({
        queryKey: ['dashboard-stats', user?.authority, user?.tenantId],
        queryFn: async () => {
            if (user?.authority === 'SYS_ADMIN') {
                const [adminStats, systemInfo, telemetry] = await Promise.all([
                    adminService.getSystemStats().catch(() => null),
                    adminService.getSystemInfo().catch(() => null),
                    adminService.getSystemTelemetry().catch(() => []),
                ]);

                return {
                    tenantCount: adminStats?.tenantCount || 0,
                    deviceCount: adminStats?.deviceCount || 0,
                    assetCount: adminStats?.assetCount || 0,
                    userCount: adminStats?.userCount || 0,
                    customerCount: adminStats?.customerCount || 0,
                    tenantProfileCount: adminStats?.tenantProfileCount || 0,
                    systemInfo,
                    telemetry
                };
            }

            // Tenant Admin logic
            const [tenants, devices, assets, alarms] = await Promise.all([
                tenantService.getTenants(0, 1).catch(() => ({ totalElements: 0 })),
                deviceService.getTenantDevices(0, 1).catch(() => ({ totalElements: 0 })),
                assetService.getTenantAssets(0, 1).catch(() => ({ totalElements: 0 })),
                alarmService.getAlarms(0, 10, 'ACTIVE_UNACK').catch(() => ({ data: [], totalElements: 0 }))
            ]);

            return {
                tenantCount: tenants.totalElements,
                deviceCount: devices.totalElements,
                assetCount: assets.totalElements,
                activeAlarms: alarms.data,
                alarmCount: alarms.totalElements
            };
        }
    });
};
