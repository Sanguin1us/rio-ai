import React, { useState, useRef, useEffect } from 'react';
import type { LineageNode } from './lineage-data';
import type { Model } from '../types/index';

interface LineageTreeProps {
  onSelectModel: (model: Model) => void;
  nodes: LineageNode[];
}

export const LineageTree: React.FC<LineageTreeProps> = ({ onSelectModel, nodes }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate node positions
  // Grid: 5 columns (0-4). Each column is 20% (100/5). Rows depend on max Y (approx 8).
  const ROW_HEIGHT = 100; // px (Reduced slightly to fit more)
  const NODE_WIDTH = 160; // px (Reduced slightly)
  const NODE_HEIGHT = 50; // px

  const getNodePosition = (x: number, y: number) => {
    // Center the node within its column
    const colWidth = dimensions.width / 5;
    const left = x * colWidth + (colWidth - NODE_WIDTH) / 2;
    const top = y * ROW_HEIGHT + 40; // +40 padding
    return { left, top };
  };

  // Helper to check if a connection should be highlighted
  const isConnectionActive = (sourceId: string, targetId: string) => {
    if (!hoveredNode) return false;
    // Highlight if hovered node is the source or target, OR if it's part of the path
    // Simple version: highlight direct connections
    return hoveredNode === sourceId || hoveredNode === targetId;
  };

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-hidden py-10"
      ref={containerRef}
      style={{ minHeight: '900px' }}
    >
      {/* SVG Layer for Connections */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="8.4"
            refX="11"
            refY="4.2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 12 4.2, 0 8.4" fill="#cbd5e1" />
          </marker>
          <marker
            id="arrowhead-faded"
            markerWidth="12"
            markerHeight="8.4"
            refX="11"
            refY="4.2"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 12 4.2, 0 8.4" fill="#cbd5e1" fillOpacity="0.1" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="22"
            markerHeight="15.4"
            refX="21"
            refY="7.7"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 22 7.7, 0 15.4" fill="#0070f3" />
          </marker>
        </defs>
        {(() => {
          // 1. Calculate all connections first
          const connections = nodes
            .flatMap((node) =>
              node.parents.map((parentId) => {
                const parent = nodes.find((n) => n.id === parentId);
                if (!parent) return null;

                const startPos = getNodePosition(parent.x, parent.y);
                const endPos = getNodePosition(node.x, node.y);

                // If parent is hovered, it scales up (scale-105). Adjust startX to avoid overlap.
                const isParentHovered = hoveredNode === parent.id;
                const scaleOffset = isParentHovered ? 6 : 0; // Approx 4px for scale + 2px gap

                const startX = startPos.left + NODE_WIDTH + scaleOffset;
                const startY = startPos.top + NODE_HEIGHT / 2;
                // Shorten the end position to prevent arrow clipping
                const endX = endPos.left - 6;
                const endY = endPos.top + NODE_HEIGHT / 2;

                const isActive = isConnectionActive(parent.id, node.id);

                // Focus Mode logic
                const isFaded = hoveredNode && !isActive;
                const opacity = isFaded ? 0.1 : isActive ? 1 : 0.4;
                const color = isActive ? '#0070f3' : '#cbd5e1';
                const width = isActive ? 3 : 1.5;

                // Smart Bézier logic
                const landingDist = 16; // Pixels of straight line before the arrow
                const curveEndX = endX - landingDist;

                const dist = Math.abs(curveEndX - startX);
                const curvature = dist > 300 ? 0.2 : 0.5;

                const controlPoint1X = startX + dist * curvature;
                const controlPoint1Y = startY;
                const controlPoint2X = curveEndX - dist * curvature;
                const controlPoint2Y = endY;

                // Curve to the landing point, then straight line to the end
                const path = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${curveEndX} ${endY} L ${endX} ${endY}`;

                return {
                  key: `${parent.id}-${node.id}`,
                  path,
                  color,
                  width,
                  opacity,
                  isActive,
                  marker: isActive ? 'arrowhead-active' : isFaded ? 'arrowhead-faded' : 'arrowhead',
                };
              })
            )
            .filter(
              (conn): conn is NonNullable<typeof conn> => conn !== null
            );

          // 2. Sort connections: Inactive first, Active last (so active draws on top)
          connections.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1));

          // 3. Render
          return connections.map((conn) => (
            <path
              key={conn.key}
              d={conn.path}
              fill="none"
              stroke={conn.color}
              strokeWidth={conn.width}
              strokeOpacity={conn.opacity}
              markerEnd={`url(#${conn.marker})`}
              className="transition-all duration-300"
              style={{ zIndex: conn.isActive ? 10 : 0 }}
            />
          ));
        })()}
      </svg>

      {/* Nodes Layer */}
      {nodes.map((node) => {
        const pos = getNodePosition(node.x, node.y);
        const isActive = hoveredNode === node.id;
        const isOmni = node.id === 'rio-omni';

        return (
          <div
            key={node.id}
            className={`absolute flex items-center justify-center p-4 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer
              ${isActive ? 'scale-105 border-rio-primary shadow-md z-10' : 'border-slate-200 bg-white hover:border-rio-primary/50'}
              ${isOmni ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none' : ''}
            `}
            style={{
              left: pos.left,
              top: pos.top,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => node.model && onSelectModel(node.model)}
          >
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = node.icon || node.model?.Icon;
                return (
                  Icon && (
                    <Icon className={`w-5 h-5 ${isOmni ? 'text-blue-400' : 'text-slate-500'}`} />
                  )
                );
              })()}
              <span
                className={`font-medium text-sm truncate ${isOmni ? 'text-white' : 'text-slate-700'}`}
              >
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
