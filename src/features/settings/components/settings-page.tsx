import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme-provider';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Globe, Palette, Trash2, Info, LogOut, UserMinus } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';

export function SettingsPage() {
    const { t, i18n } = useTranslation();
    const { setTheme, theme } = useTheme();
    const { logout, isImpersonating, exitImpersonation } = useAuthStore();
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleClearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="h-full p-8 space-y-8 overflow-auto pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight glow-text">{t('settings.title')}</h2>
                <p className="text-muted-foreground">{t('settings.subtitle')}</p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Appearance */}
                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Palette className="text-primary" />
                        <h3>{t('settings.appearance')}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['cyber', 'dark', 'light', 'industrial', 'forest', 'matrix'].map((tName) => (
                            <div
                                key={tName}
                                className={`
                                    cursor-pointer rounded-lg border-2 p-4 text-center capitalize transition-all
                                    ${theme === tName ? 'border-primary bg-primary/10' : 'border-dashed border-white/10 hover:border-white/20'}
                                `}
                                onClick={() => setTheme(tName as any)}
                            >
                                <div className="font-bold">{t(`theme.${tName}`)}</div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Internationalization */}
                <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Globe className="text-secondary" />
                        <h3>{t('settings.language')}</h3>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant={i18n.language === 'en' ? 'neon' : 'outline'}
                            onClick={() => changeLanguage('en')}
                        >
                            English
                        </Button>
                        <Button
                            variant={i18n.language === 'zh-CN' ? 'neon' : 'outline'}
                            onClick={() => changeLanguage('zh-CN')}
                        >
                            简体中文
                        </Button>
                    </div>
                </GlassCard>

                {/* Account Actions */}
                <div className="space-y-6">
                    {isImpersonating && (
                        <GlassCard className="p-6 space-y-4 border-primary/30 bg-primary/5">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <UserMinus className="text-primary" />
                                <h3>{t('settings.exitImpersonation')}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.exitImpersonationDesc')}
                            </p>
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={exitImpersonation}>
                                    <UserMinus size={16} className="mr-2" />
                                    {t('settings.switchBack')}
                                </Button>
                            </div>
                        </GlassCard>
                    )}

                    <GlassCard className="p-6 space-y-4 border-primary/20">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <LogOut className="text-primary" />
                            <h3>{t('settings.authSession')}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.logoutConfirmDesc')}
                        </p>
                        <div className="flex justify-end">
                            <Button variant="destructive" onClick={() => setShowLogoutDialog(true)}>
                                <LogOut size={16} className="mr-2" />
                                {t('settings.logout')}
                            </Button>
                        </div>
                    </GlassCard>
                </div>

                {/* System */}
                <GlassCard className="p-6 space-y-4 border-destructive/20">
                    <div className="flex items-center gap-2 text-lg font-semibold text-destructive">
                        <Trash2 />
                        <h3>{t('settings.system')}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.clearCacheDesc')}
                    </p>
                    <div className="flex justify-end">
                        <Button variant="destructive" onClick={() => setShowResetDialog(true)}>
                            {t('settings.clearCache')}
                        </Button>
                    </div>
                </GlassCard>

                {/* About */}
                <GlassCard className="p-6 flex items-center gap-4">
                    <Info className="text-muted-foreground" />
                    <div>
                        <div className="font-bold">{t('app.title')}</div>
                        <div className="text-xs text-muted-foreground">
                            {t('app.version')} • {t('app.copyright')} • {t('settings.author')}: {t('settings.authorName')}
                        </div>
                    </div>
                </GlassCard>
            </div>

            <ConfirmDialog
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title={t('settings.resetConfirmTitle')}
                description={t('settings.resetConfirmDesc')}
                variant="destructive"
                confirmText={t('settings.resetAction')}
                cancelText={t('common.cancel')}
                onConfirm={handleClearCache}
            />

            <ConfirmDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                title={t('settings.logoutConfirmTitle')}
                description={t('settings.logoutConfirmDesc')}
                variant="destructive"
                confirmText={t('settings.logout')}
                cancelText={t('common.cancel')}
                onConfirm={handleLogout}
            />
        </div>
    );
}
