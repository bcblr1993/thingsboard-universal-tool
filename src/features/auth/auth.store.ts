import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Environment, TokenPair, User } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
    environments: Environment[];
    activeEnvId: string | null;
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    originalUser: User | null;
    originalToken: string | null;
    isAuthenticated: boolean;
    isImpersonating: boolean;

    // Actions
    addEnvironment: (name: string, url: string) => void;
    removeEnvironment: (id: string) => void;
    selectEnvironment: (id: string) => void;
    setTokens: (tokens: TokenPair) => void;
    setUser: (user: User) => void;
    impersonate: (user: User, token: string) => void;
    exitImpersonation: () => void;
    logout: () => void;
}

// Custom storage adapter for Electron Store could be added here, 
// using localStorage for now as 'electron-store' usage in renderer requires IPC setup or direct nodeIntegration (if enabled).
// We configured nodeIntegration:false, contextIsolation:true, so localStorage is safest/easiest for now.

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            environments: [
                { id: '1', name: 'Localhost', baseUrl: 'http://localhost:8080', lastUsed: true }
            ],
            activeEnvId: '1',
            token: null,
            refreshToken: null,
            user: null,
            originalUser: null,
            originalToken: null,
            isAuthenticated: false,
            isImpersonating: false,

            addEnvironment: (name, url) => {
                const newEnv: Environment = {
                    id: uuidv4(),
                    name,
                    baseUrl: url,
                };
                set((state) => ({
                    environments: [...state.environments, newEnv],
                    activeEnvId: newEnv.id
                }));
            },

            removeEnvironment: (id) => {
                set((state) => {
                    const newEnvs = state.environments.filter((e) => e.id !== id);
                    const newActiveId = id === state.activeEnvId
                        ? (newEnvs.length > 0 ? newEnvs[0].id : null)
                        : state.activeEnvId;
                    return {
                        environments: newEnvs,
                        activeEnvId: newActiveId
                    };
                });
            },

            selectEnvironment: (id) => {
                set({ activeEnvId: id, isAuthenticated: false, token: null, user: null, originalUser: null, originalToken: null, isImpersonating: false });
            },

            setTokens: (tokens) => {
                set({
                    token: tokens.token,
                    refreshToken: tokens.refreshToken,
                    isAuthenticated: true
                });
            },

            setUser: (user) => {
                set({ user });
            },

            impersonate: (user, token) => {
                const currentToken = get().token;
                const currentUser = get().user;
                set({
                    originalUser: get().isImpersonating ? get().originalUser : currentUser,
                    originalToken: get().isImpersonating ? get().originalToken : currentToken,
                    user,
                    token,
                    isImpersonating: true
                });
            },

            exitImpersonation: () => {
                const { originalUser, originalToken } = get();
                if (originalUser && originalToken) {
                    set({
                        user: originalUser,
                        token: originalToken,
                        originalUser: null,
                        originalToken: null,
                        isImpersonating: false
                    });
                }
            },

            logout: () => {
                set({
                    token: null,
                    refreshToken: null,
                    user: null,
                    originalUser: null,
                    originalToken: null,
                    isAuthenticated: false,
                    isImpersonating: false
                });
            }
        }),
        {
            name: 'tb-auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                environments: state.environments,
                activeEnvId: state.activeEnvId,
                // Optionally persist token? Usually safer not to persist sensitive tokens in localStorage plaintext 
                // but for a desktop tool convenience often wins. Design doc mentioned "safeStorage" for tokens.
                // For P1, we will skip persistence of tokens in localStorage and just persist Environments.
            }),
        }
    )
);
