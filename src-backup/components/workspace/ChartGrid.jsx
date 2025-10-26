import React, { useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from './withSize';
import ChartPanel from './ChartPanel';

const layouts = {
    '1x1': [{ i: 'a', x: 0, y: 0, w: 12, h: 8 }],
    '2x2': [
        { i: 'a', x: 0, y: 0, w: 6, h: 4 },
        { i: 'b', x: 6, y: 0, w: 6, h: 4 },
        { i: 'c', x: 0, y: 4, w: 6, h: 4 },
        { i: 'd', x: 6, y: 4, w: 6, h: 4 }
    ]
};

const ChartGrid = ({ width, layoutId, panelAssets, onAssetChange }) => {
    const { layout, items } = useMemo(() => {
        const currentLayout = layouts[layoutId] || layouts['1x1'];
        return {
            layout: currentLayout,
            items: currentLayout.map(item => item.i)
        };
    }, [layoutId]);

    return (
        <GridLayout 
            className="layout" 
            layout={layout} 
            cols={12} 
            rowHeight={width / 20} 
            width={width}
            isDraggable={true}
            isResizable={true}
        >
            {items.map(key => (
                <div key={key}>
                    <ChartPanel 
                        initialAsset={panelAssets[key]} 
                        onAssetChange={(asset) => onAssetChange(key, asset)} 
                    />
                </div>
            ))}
        </GridLayout>
    );
};

export default withSize(ChartGrid);
