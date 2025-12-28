import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Plus, Server, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/features/auth/auth.store';
import { authService } from '@/features/auth/auth.service';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

export function LoginPage() {
    const { t } = useTranslation();
    const { environments, activeEnvId, selectEnvironment, addEnvironment, removeEnvironment } = useAuthStore();

    const [username, setUsername] = useState('sysadmin@thingsboard.org');
    const [password, setPassword] = useState('sysadmin');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Add Environment State
    const [showAddEnv, setShowAddEnv] = useState(false);
    const [newEnvName, setNewEnvName] = useState('');
    const [newEnvUrl, setNewEnvUrl] = useState('http://localhost:8080');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authService.login(username, password);
        } catch (err: any) {
            console.error('Login error:', err);
            // Try to get the specific error message from the API response
            const msg = err.response?.data?.message || err.message;

            // Map common errors to localized strings
            let displayMsg = t('auth.loginFailed');
            if (msg) {
                const mappedKey = `auth.errors.${msg}`;
                const translated = t(mappedKey);
                if (translated !== mappedKey) {
                    displayMsg = translated;
                } else {
                    displayMsg = msg; // Fallback to server message
                }
            }
            setError(displayMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEnvironment = () => {
        if (newEnvName && newEnvUrl) {
            addEnvironment(newEnvName, newEnvUrl);
            setShowAddEnv(false);
            setNewEnvName('');
            setNewEnvUrl('http://localhost:8080');
        }
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative z-10">
                <div className="space-y-6 max-w-lg">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent glow-text">
                        {t('auth.marketingTitle1')}<br />{t('auth.marketingTitle2')}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t('auth.marketingDesc')}
                    </p>
                    <div className="flex gap-4 pt-4">
                        <GlassCard className="p-4 flex items-center gap-3 w-40">
                            <Monitor className="text-primary" />
                            <div>
                                <div className="text-xs text-muted-foreground">{t('auth.version')}</div>
                                <div className="font-bold">{t('app.version')}</div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4 flex items-center gap-3 w-40">
                            <Server className="text-secondary" />
                            <div>
                                <div className="text-xs text-muted-foreground">{t('auth.protocol')}</div>
                                <div className="font-bold">REST/RPC</div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-20">
                <GlassCard variant="glowing" className="w-full max-w-md p-8 glass-panel border border-primary/20">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">{t('auth.welcome')}</h2>
                            <p className="text-sm text-muted-foreground">{t('auth.subtitle')}</p>
                        </div>

                        {/* Environment Selector */}
                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.env')}</label>
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={activeEnvId || ''}
                                    onChange={(e) => selectEnvironment(e.target.value)}
                                >
                                    {environments.map(env => (
                                        <option key={env.id} value={env.id}>{env.name} - {env.baseUrl}</option>
                                    ))}
                                </select>
                                <Button variant="outline" size="icon" onClick={() => setShowAddEnv(true)} title={t('auth.addEnv')}>
                                    <Plus size={18} />
                                </Button>
                                {environments.length > 1 && (
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                                        onClick={() => activeEnvId && removeEnvironment(activeEnvId)}>
                                        <Trash2 size={18} />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.username')}</label>
                                <input
                                    type="text"
                                    className="w-full bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('auth.username')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.password')}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && <div className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">{error}</div>}

                            <Button type="submit" variant="neon" className="w-full" disabled={isLoading}>
                                {isLoading ? t('common.loading') : t('auth.login')}
                            </Button>
                        </form>
                    </div>
                </GlassCard>
            </div>

            {/* Add Environment Dialog */}
            <ConfirmDialog
                open={showAddEnv}
                onOpenChange={setShowAddEnv}
                title={t('auth.addEnvTitle')}
                description={t('auth.addEnvDesc')}
            >
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm">{t('auth.envName')}</label>
                        <input
                            className="w-full bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={newEnvName}
                            onChange={e => setNewEnvName(e.target.value)}
                            placeholder={t('auth.envNamePlaceholder')}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">{t('auth.baseUrl')}</label>
                        <input
                            className="w-full bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={newEnvUrl}
                            onChange={e => setNewEnvUrl(e.target.value)}
                            placeholder="http://..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="ghost" onClick={() => setShowAddEnv(false)}>{t('common.cancel')}</Button>
                        <Button variant="default" onClick={handleAddEnvironment}>{t('auth.createConnection')}</Button>
                    </div>
                </div>
            </ConfirmDialog>
        </div>
    );
}

// Temporary default export for routing
export default LoginPage;
