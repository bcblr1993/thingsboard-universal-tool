import { useTenants } from "../hooks";
import { GlassCard } from "@/components/ui/glass-card";
import { useTranslation } from "react-i18next";
import { Search, User, MapPin, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authService } from "@/features/auth/auth.service";
import { useNavigate } from "react-router-dom";

export function TenantList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const { data, isLoading, isError } = useTenants(page, 50, search);

    const handleMagicJump = async (tenantId: string) => {
        try {
            await authService.impersonateTenant(tenantId);
            navigate('/');
        } catch (err) {
            console.error('Failed to magic jump:', err);
        }
    };

    if (isLoading) return <div className="p-8 text-muted-foreground">{t('common.loading')}</div>;
    if (isError) return <div className="p-8 text-destructive">Failed to load tenants.</div>;

    return (
        <div className="space-y-6 p-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight glow-text">{t('nav.tenants')}</h2>
                    <p className="text-muted-foreground">{t('tenant.listSubtitle')}</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-background/50 border border-input rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder={t('common.search')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Tenant List */}
            <div className="space-y-2">
                {/* List Header - Hidden on mobile, shown on desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-white/5">
                    <div className="col-span-4">{t('nav.tenants')}</div>
                    <div className="col-span-3">{t('tenant.email')}</div>
                    <div className="col-span-2">{t('tenant.status')}</div>
                    <div className="col-span-3 text-right"></div>
                </div>

                <div className="space-y-2">
                    {data?.data.map((tenant: any) => (
                        <GlassCard
                            key={tenant.id.id}
                            className="group transition-all hover:bg-white/5 hover:border-primary/30 border-white/5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center">
                                {/* Title & Icon */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                        {tenant.title.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base truncate" title={tenant.title}>
                                            {tenant.title}
                                        </h3>
                                        {tenant.city && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                                <MapPin size={10} />
                                                <span>{tenant.city}{tenant.country ? `, ${tenant.country}` : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-span-1 md:col-span-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                                        <Mail size={14} className="shrink-0" />
                                        <span className="truncate">{tenant.email}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="inline-flex items-center px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase tracking-tighter">
                                        <Zap size={10} className="mr-1 fill-green-500" />
                                        {t('tenant.active')}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-3 flex justify-end gap-2 shrink-0">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-xs hover:bg-white/10"
                                        onClick={() => {/* Manage details */ }}
                                    >
                                        <User size={14} className="mr-1.5" />
                                        {t('tenant.manage')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="neon"
                                        className="h-8 text-xs px-4"
                                        onClick={() => handleMagicJump(tenant.id.id)}
                                    >
                                        <Zap size={14} className="mr-1.5" />
                                        {t('tenant.magicJump')}
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Pagination (Simple) */}
            <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>{t('common.prev')}</Button>
                <span className="flex items-center text-sm text-muted-foreground">{t('common.page')} {page + 1}</span>
                <Button variant="outline" disabled={!data?.hasNext} onClick={() => setPage(p => p + 1)}>{t('common.next')}</Button>
            </div>
        </div>
    );
}
