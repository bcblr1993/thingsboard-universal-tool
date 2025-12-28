import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Package } from 'lucide-react'; // Fixed import

export const CyberNode = memo(({ data, selected }: any) => {
    return (
        <div className={`
            px-4 py-2 rounded-md shadow-md min-w-[180px] border 
            transition-all duration-300 backdrop-blur-md
            ${selected
                ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]'
                : 'bg-black/40 border-white/10 hover:border-primary/50'}
        `}>
            {/* Input Handle */}
            <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-1 !rounded-none" />

            <div className="flex items-center gap-3">
                <div className={`
                    p-2 rounded bg-gradient-to-br from-white/5 to-white/0 border border-white/5
                    ${selected ? 'text-primary' : 'text-muted-foreground'}
                `}>
                    {data.type === 'ASSET' ? <Package size={20} /> : <Box size={20} />}
                </div>
                <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{data.label || data.type}</div>
                    <div className="font-bold text-sm truncate max-w-[120px]" title={data.name}>{data.name}</div>
                </div>
            </div>

            {/* Status indicator (fake for now) */}
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]" />
            </div>

            {/* Output Handle */}
            <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-1 !rounded-none" />
        </div>
    );
});
