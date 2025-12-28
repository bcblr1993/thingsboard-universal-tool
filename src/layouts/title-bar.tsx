import { Maximize, Minimize, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function TitleBar() {
    const { t } = useTranslation();
    const [isMaximized, setIsMaximized] = useState(false)

    const handleMinimize = () => {
        window.ipcRenderer?.send('window-min')
    }
    const handleMaximize = () => {
        window.ipcRenderer?.send('window-max')
        setIsMaximized(!isMaximized)
    }
    const handleClose = () => {
        window.ipcRenderer?.send('window-close')
    }

    return (
        <div className="h-10 w-full flex items-center justify-between px-4 select-none draggable bg-background/50 backdrop-blur-sm border-b border-white/5 z-50 shrink-0">
            <div className="flex items-center gap-2 pl-20">
                <div className="text-xs font-bold tracking-widest text-primary/80 uppercase">{t('app.title')}</div>
            </div>
            <div className="flex items-center gap-1 no-drag">
                <button onClick={handleMinimize} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground">
                    <Minimize size={14} />
                </button>
                <button onClick={handleMaximize} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground">
                    <Maximize size={14} />
                </button>
                <button onClick={handleClose} className="p-1.5 hover:bg-destructive/80 hover:text-white rounded-md transition-colors text-muted-foreground ">
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
