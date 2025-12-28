import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: 'electron/main/index.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron/main',
                        lib: {
                            entry: 'electron/main/index.ts',
                            formats: ['es'],
                            fileName: 'index',
                        },
                    },
                },
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`.
                input: 'electron/preload/index.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron/preload',
                        lib: {
                            entry: 'electron/preload/index.ts',
                            formats: ['cjs'],
                            fileName: 'index',
                        },
                    },
                },
            },
            // Ployfill the Electron and Node.js built-in modules for Renderer process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer: {},
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
