import { useTranslation } from 'react-i18next';
import { Server, Activity, Package, Cpu, AlertTriangle, Users, UserCheck, Settings2, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { useDashboardStats } from '../hooks';
import { useAuthStore } from '@/features/auth/auth.store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { data: stats, isLoading } = useDashboardStats();

    const StatCard = ({ value, icon, to, label, color = "primary", subtitle }: any) => (
        <GlassCard
            variant="glowing"
            className="p-4 h-32 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => to && navigate(to)}
        >
            <div className="flex justify-between items-start">
                <div className={`p-2.5 bg-${color}/10 rounded-lg text-${color}`}>
                    {icon}
                </div>
                {isLoading && <span className="text-xs text-muted-foreground animate-pulse">{t('dashboard.syncing')}</span>}
            </div>
            <div>
                <div className="text-3xl font-bold tracking-tight mb-0.5">
                    {isLoading ? '-' : (value ?? 0)}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
                {subtitle && <div className="text-[10px] text-muted-foreground/60">{subtitle}</div>}
            </div>
        </GlassCard>
    );

    const UsageBar = ({ label, value, color, detail }: any) => (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
            {detail && <div className="text-[10px] text-muted-foreground/60 text-right">{detail}</div>}
        </div>
    );

    return (
        <div className="p-4 space-y-4 overflow-auto pb-20">

            {/* Entity Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {user?.authority === 'SYS_ADMIN' ? (
                    <>
                        <StatCard
                            value={stats?.tenantCount}
                            icon={<Server size={20} />}
                            to="/tenants"
                            label={t('nav.tenants')}
                            color="primary"
                        />
                        <StatCard
                            value={stats?.tenantProfileCount}
                            icon={<Settings2 size={20} />}
                            label={t('dashboard.totalTenantProfiles')}
                            color="secondary"
                        />
                        <StatCard
                            value={stats?.deviceCount}
                            icon={<Cpu size={20} />}
                            to="/devices"
                            label={t('nav.devices')}
                            color="primary"
                        />
                        <StatCard
                            value={stats?.assetCount}
                            icon={<Package size={20} />}
                            to="/topology"
                            label={t('nav.topology')}
                            color="secondary"
                        />
                        <StatCard
                            value={stats?.userCount}
                            icon={<Users size={20} />}
                            label={t('dashboard.totalUsers')}
                            color="primary"
                        />
                        <StatCard
                            value={stats?.customerCount}
                            icon={<UserCheck size={20} />}
                            label={t('dashboard.totalCustomers')}
                            color="secondary"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            value={stats?.deviceCount}
                            icon={<Cpu size={20} />}
                            to="/devices"
                            label={t('nav.devices')}
                            color="primary"
                        />
                        <StatCard
                            value={stats?.assetCount}
                            icon={<Package size={20} />}
                            to="/topology"
                            label={t('nav.topology')}
                            color="secondary"
                        />
                    </>
                )}

                {user?.authority !== 'SYS_ADMIN' && (
                    <StatCard
                        value={stats?.activeAlarms?.length || stats?.alarmCount}
                        icon={<AlertTriangle size={20} />}
                        label={t('dashboard.recentAlarms')}
                        color="destructive"
                    />
                )}
            </div>

            {/* System Health / Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {user?.authority === 'SYS_ADMIN' && (
                    <GlassCard className="p-6 space-y-6">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                            <Activity size={16} className="text-primary" />
                            {t('dashboard.systemHealth')}
                        </h3>
                        <div className="space-y-4">
                            <UsageBar
                                label={t('dashboard.cpuUsage')}
                                value={stats?.systemInfo?.cpuUsage ?? 0}
                                color="primary"
                                detail={`${stats?.systemInfo?.cpuCount ?? 0} Cores`}
                            />
                            <UsageBar
                                label={t('dashboard.memoryUsage')}
                                value={stats?.systemInfo?.memoryUsage ?? 0}
                                color="secondary"
                                detail={`${((stats?.systemInfo?.totalMemory ?? 0) / (1024 * 1024 * 1024)).toFixed(0)} GB Total`}
                            />
                            <UsageBar
                                label={t('dashboard.diskUsage')}
                                value={stats?.systemInfo?.discUsage ?? 0}
                                color="primary"
                                detail={`${((stats?.systemInfo?.totalDiscSpace ?? 0) / (1024 * 1024 * 1024)).toFixed(0)} GB Total`}
                            />
                        </div>
                    </GlassCard>
                )}

                <GlassCard className={`p-6 ${user?.authority === 'SYS_ADMIN' ? 'lg:col-span-2' : 'lg:col-span-3'} min-h-[300px]`}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                        {user?.authority === 'SYS_ADMIN' ? (
                            <>
                                <Activity size={16} className="text-secondary" />
                                {t('dashboard.last30DaysMessages')}
                            </>
                        ) : (
                            <>
                                <Database size={16} className="text-secondary" />
                                {t('dashboard.tenantActivity')}
                            </>
                        )}
                    </h3>

                    {user?.authority === 'SYS_ADMIN' ? (
                        <div className="h-64 w-full">
                            {stats?.telemetry ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.telemetry}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis
                                            dataKey="ts"
                                            hide
                                        />
                                        <YAxis
                                            hide
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                            itemStyle={{ color: '#0ea5e9' }}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#0ea5e9"
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-black/20 rounded-lg border border-white/5 border-dashed">
                                    <Activity size={32} className="mb-2 opacity-20" />
                                    <span className="text-sm opacity-50">{t('dashboard.syncing')}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-black/20 rounded-lg border border-white/5 border-dashed">
                            <Activity size={32} className="mb-2 opacity-20" />
                            <span className="text-sm opacity-50">{t('dashboard.syncing')}</span>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
