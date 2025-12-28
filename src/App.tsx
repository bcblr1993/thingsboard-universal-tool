import { HashRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { TitleBar } from "./layouts/title-bar"
import { useTranslation } from "react-i18next"
import { Monitor, Server, Activity, Settings, Cpu } from "lucide-react"
import { TenantList } from "./features/tenant/components/tenant-list";
import { TopologyView } from "./features/topology/components/topology-view";
import { DeviceList } from "./features/devices/components/device-list";
import { SettingsPage } from "./features/settings/components/settings-page";
import { useAuthStore } from "./features/auth/auth.store";
import { DashboardView } from "./features/dashboard/components/dashboard-view";
import LoginPage from "./features/auth/components/login-page";

// ... inline Dashboard removed ...
function MainLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore(state => state.user);

    const isActive = (path: string) => location.pathname === path;
    const navItemClass = (path: string) => `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isActive(path) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-white/5'}`;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden selection:bg-primary/30">
            <TitleBar />
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-16 md:w-64 border-r border-white/5 bg-background/30 backdrop-blur-xl flex flex-col z-20 relative">
                    <nav className="flex-1 p-4 space-y-2">
                        <div className={navItemClass('/')} onClick={() => navigate('/')}>
                            <Monitor size={20} />
                            <span className="hidden md:block font-medium">{t('nav.dashboard')}</span>
                        </div>

                        {user?.authority === 'TENANT_ADMIN' && (
                            <>
                                <div className={navItemClass('/topology')} onClick={() => navigate('/topology')}>
                                    <Activity size={20} />
                                    <span className="hidden md:block font-medium">{t('nav.topology')}</span>
                                </div>
                                <div className={navItemClass('/devices')} onClick={() => navigate('/devices')}>
                                    <Cpu size={20} />
                                    <span className="hidden md:block font-medium">{t('nav.devices')}</span>
                                </div>
                            </>
                        )}

                        {user?.authority === 'SYS_ADMIN' && (
                            <div className={navItemClass('/tenants')} onClick={() => navigate('/tenants')}>
                                <Server size={20} />
                                <span className="hidden md:block font-medium">{t('nav.tenants')}</span>
                            </div>
                        )}
                    </nav>
                    <div className="p-4 border-t border-white/5">
                        <div className={navItemClass('/settings')} onClick={() => navigate('/settings')}>
                            <Settings size={20} />
                            <span className="hidden md:block font-medium">{t('nav.settings')}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-[url('/bg-grid.svg')] bg-fixed">
                    <div className="absolute inset-0 bg-background/80 pointer-events-none" />
                    <div className="relative z-10 w-full h-full">
                        <Routes>
                            <Route path="/" element={<DashboardView />} />
                            <Route path="/tenants" element={<TenantList />} />
                            <Route path="/topology" element={<TopologyView />} />
                            <Route path="/devices" element={<DeviceList />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}

function App() {
    // Auth Guard
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (!isAuthenticated) {
        return (
            <>
                <TitleBar />
                <LoginPage />
            </>
        );
    }

    return (
        <HashRouter>
            <MainLayout />
        </HashRouter>
    )
}

export default App
