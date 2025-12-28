import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Cpu, Key, Wifi } from 'lucide-react';
import { useDevices } from '../hooks';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { deviceService } from '../device.service';

export function DeviceList() {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useDevices(page, pageSize, search);

    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<any>(null);
    const [showCreds, setShowCreds] = useState(false);

    const handleShowCredentials = async (id: string) => {
        try {
            const creds = await deviceService.getDeviceCredentials(id);
            setCredentials(creds);
            setSelectedDeviceId(id);
            setShowCreds(true);
        } catch (e) {
            console.error(e);
            alert("Failed to fetch credentials");
        }
    }

    return (
        <div className="h-full p-4 lg:p-8 pb-20 space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight glow-text">{t('device.listTitle')}</h2>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t('device.listSubtitle')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full bg-background/50 border border-input rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            placeholder={t('common.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="neon" className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> {t('device.provision')}
                    </Button>
                </div>
            </div>

            {isLoading && <div className="text-muted-foreground">{t('common.loading')}</div>}

            <div className="space-y-2">
                {/* List Header - Hidden on small screens */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-white/5">
                    <div className="col-span-3">{t('device.deviceName')}</div>
                    <div className="col-span-2">{t('device.deviceProfile')}</div>
                    <div className="col-span-2">{t('device.label')}</div>
                    <div className="col-span-2">{t('device.status')}</div>
                    <div className="col-span-3 text-right"></div>
                </div>

                <div className="space-y-2 min-h-[400px]">
                    {data?.data.map((device: any) => (
                        <GlassCard key={device.id.id} className="group transition-all hover:bg-white/5 hover:border-primary/30 border-white/5 p-0 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 lg:px-6 py-4 items-center">
                                {/* Device Name & Icon */}
                                <div className="col-span-1 lg:col-span-3 flex items-center gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                        <Cpu size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base truncate" title={device.name}>
                                            {device.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Device Profile */}
                                <div className="col-span-1 lg:col-span-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-muted-foreground uppercase truncate" title={device.deviceProfileName}>
                                        {device.deviceProfileName || '-'}
                                    </span>
                                </div>

                                {/* Label */}
                                <div className="col-span-1 lg:col-span-2">
                                    <span className="text-sm text-muted-foreground truncate" title={device.label}>
                                        {device.label || '-'}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 lg:col-span-2">
                                    {device.active !== undefined ? (
                                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter ${device.active
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${device.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {device.active ? t('device.active') : t('device.inactive')}
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center px-2 py-0.5 rounded bg-gray-500/10 text-gray-500 text-[10px] font-bold border border-gray-500/20 uppercase tracking-tighter">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1.5" />
                                            {t('common.unknown') || 'Unknown'}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 lg:col-span-3 flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-white/10" onClick={() => handleShowCredentials(device.id.id)}>
                                        <Key size={14} className="mr-1.5" /> {t('device.auth')}
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-xs text-secondary hover:text-secondary hover:bg-secondary/10">
                                        <Wifi size={14} className="mr-1.5" /> {t('device.monitor')}
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                    {!isLoading && (!data?.data || data.data.length === 0) && (
                        <div className="text-center py-20 text-muted-foreground">
                            {t('common.noData') || 'No devices found'}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination & PageSize */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{t('common.pageSize') || 'Show'}</span>
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {[10, 20, 30].map((size) => (
                            <button
                                key={size}
                                onClick={() => {
                                    setPageSize(size);
                                    setPage(0);
                                }}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${pageSize === size
                                        ? 'bg-primary text-black shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]'
                                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-bold border-white/10 hover:border-primary/50"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        {t('common.prev')}
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px] text-xs font-bold text-muted-foreground">
                        <span className="text-white mr-1">{t('common.page')} {page + 1}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-bold border-white/10 hover:border-primary/50"
                        disabled={!data?.hasNext}
                        onClick={() => setPage(p => p + 1)}
                    >
                        {t('common.next')}
                    </Button>
                </div>
            </div>

            {/* Credentials Dialog */}
            <ConfirmDialog
                open={showCreds}
                onOpenChange={setShowCreds}
                title={t('device.credsTitle')}
                description={`${t('device.credsDesc')} - ${selectedDeviceId}`}
                confirmText={t('common.copy')}
                cancelText={t('common.close')}
                onConfirm={() => {
                    if (credentials?.credentialsId) {
                        navigator.clipboard.writeText(credentials.credentialsId);
                    }
                }}
            >
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase text-muted-foreground font-bold">{t('device.credsType')}</label>
                        <div className="p-2 rounded border border-white/10 bg-black/20 text-sm font-mono text-secondary">
                            {credentials?.credentialsType || t('common.loading')}
                        </div>
                    </div>

                    {credentials?.credentialsType === 'MQTT_BASIC' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted-foreground font-bold">{t('device.clientId')}</label>
                                <div className="p-2 rounded border border-white/10 bg-black/20 text-sm font-mono break-all text-primary">
                                    {credentials?.credentialsId || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted-foreground font-bold">{t('device.username')}</label>
                                <div className="p-2 rounded border border-white/10 bg-black/20 text-sm font-mono break-all text-primary">
                                    {JSON.parse(credentials?.credentialsValue || '{}').userName || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted-foreground font-bold">{t('device.password')}</label>
                                <div className="p-2 rounded border border-white/10 bg-black/20 text-sm font-mono break-all text-primary">
                                    {JSON.parse(credentials?.credentialsValue || '{}').password || 'N/A'}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs uppercase text-muted-foreground font-bold">{t('device.token')}</label>
                            <div className="p-2 rounded border border-white/10 bg-black/20 text-sm font-mono break-all text-primary">
                                {credentials?.credentialsId || 'N/A'}
                            </div>
                        </div>
                    )}
                </div>
            </ConfirmDialog>
        </div>
    )
}


