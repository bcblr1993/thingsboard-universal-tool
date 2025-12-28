import * as React from 'react'
import { cn } from '@/lib/utils'

const GlassCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'glowing' | 'solid'
        intensity?: 'low' | 'medium' | 'high'
    }
>(({ className, variant = 'default', intensity = 'medium', ...props }, ref) => {

    const intensityMap = {
        low: 'backdrop-blur-sm bg-background/40',
        medium: 'backdrop-blur-md bg-background/60',
        high: 'backdrop-blur-xl bg-background/80',
    }

    const variantMap = {
        default: 'border border-border/50 shadow-lg',
        glowing: 'border border-primary/50 shadow-[0_0_15px_-3px_rgba(0,243,255,0.15)] bg-cyber-glass',
        solid: 'bg-card border border-border shadow-sm'
    }

    return (
        <div
            ref={ref}
            className={cn(
                'rounded-xl text-card-foreground',
                intensityMap[intensity],
                variantMap[variant],
                className
            )}
            {...props}
        />
    )
})
GlassCard.displayName = 'GlassCard'

export { GlassCard }
