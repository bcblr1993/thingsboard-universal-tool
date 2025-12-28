import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { assetService } from '@/features/assets/asset.service';
import { Button } from '@/components/ui/button';
import { RotateCw, GitBranch, Plus } from 'lucide-react';
import { CyberNode } from './cyber-node';
import { getLayoutedElements } from '../layout-utils';

const nodeTypes = {
    cyber: CyberNode,
};

export function TopologyView() {
    const { t } = useTranslation();

    // Initial State
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load Root Assets (Just first 50 for now)
    const loadAssets = async () => {
        setIsLoading(true);
        try {
            const data = await assetService.getTenantAssets(0, 50);

            // Transform to Nodes
            const newNodes: Node[] = data.data.map((asset, index) => ({
                id: asset.id.id,
                type: 'cyber',
                position: { x: (index % 5) * 250, y: Math.floor(index / 5) * 100 }, // Grid init
                data: {
                    name: asset.name,
                    type: asset.type,
                    label: asset.label
                },
            }));

            // No edges initially since we just fetched list
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                newNodes,
                [],
                'LR'
            );

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            nodes,
            edges,
            'LR' // Left to Right
        );
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [nodes, edges, setNodes, setEdges]);

    return (
        <div className="h-full w-full relative bg-background">
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Button variant="neon" size="sm" onClick={loadAssets} disabled={isLoading}>
                    <RotateCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('asset.refresh')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleAutoLayout}>
                    <GitBranch className="mr-2 h-4 w-4" />
                    {t('asset.autoLayout')}
                </Button>
                <Button variant="ghost" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('asset.add')}
                </Button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-black/20"
            >
                <Background color="#0ea5e9" gap={20} size={1} className="opacity-10" />
                <Controls className="bg-background border border-white/10 fill-primary text-primary" />
            </ReactFlow>
        </div>
    );
}
