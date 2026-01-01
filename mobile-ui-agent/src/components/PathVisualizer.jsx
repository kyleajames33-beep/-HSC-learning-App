import React from 'react';
import { motion } from 'framer-motion';

/**
 * PathVisualizer - Generates SVG paths connecting dotpoints in a visual journey
 *
 * Features:
 * - Winding S-curve path for visual appeal
 * - Different styles per subject (DNA helix for biology, molecular chain for chemistry)
 * - Path segments colored by status (gray=locked, blue=available, green=complete)
 * - Animated path reveal as dotpoints unlock
 */

const PathVisualizer = ({
  nodes,
  subject = 'biology',
  viewportWidth = 400,
  onNodeClick
}) => {
  // Configuration for subject-specific styling
  const subjectStyles = {
    biology: {
      pathColor: {
        locked: '#D1D5DB',
        available: '#3B82F6',
        complete: '#10B981'
      },
      pathWidth: 4,
      pathStyle: 'helix', // DNA helix-style curves
      gradient: 'from-green-500 to-blue-500'
    },
    chemistry: {
      pathColor: {
        locked: '#D1D5DB',
        available: '#8B5CF6',
        complete: '#10B981'
      },
      pathWidth: 4,
      pathStyle: 'molecular', // Molecular bond-style straight segments
      gradient: 'from-purple-500 to-indigo-500'
    }
  };

  const style = subjectStyles[subject] || subjectStyles.biology;

  // Calculate positions for nodes in a winding path
  const calculateNodePositions = () => {
    const positions = [];
    const padding = 60;
    const usableWidth = viewportWidth - (padding * 2);
    const verticalSpacing = 140; // Space between nodes vertically
    const amplitude = usableWidth / 2; // How far the path swings left/right

    nodes.forEach((node, index) => {
      const y = padding + (index * verticalSpacing);

      // Create winding S-curve pattern
      let x;
      if (style.pathStyle === 'helix') {
        // DNA helix style - sinusoidal wave
        x = padding + amplitude + (amplitude * Math.sin(index * Math.PI / 3));
      } else {
        // Molecular style - zigzag
        x = index % 2 === 0 ? padding : viewportWidth - padding;
      }

      positions.push({
        x,
        y,
        node
      });
    });

    return positions;
  };

  const nodePositions = calculateNodePositions();

  // Generate SVG path string connecting all nodes
  const generatePathData = () => {
    if (nodePositions.length < 2) return '';

    let pathData = `M ${nodePositions[0].x} ${nodePositions[0].y}`;

    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];

      if (style.pathStyle === 'helix') {
        // Smooth curves using quadratic bezier
        const controlX = (prev.x + curr.x) / 2;
        const controlY = (prev.y + curr.y) / 2;
        pathData += ` Q ${controlX} ${controlY}, ${curr.x} ${curr.y}`;
      } else {
        // Straight lines for molecular style
        pathData += ` L ${curr.x} ${curr.y}`;
      }
    }

    return pathData;
  };

  // Generate path segments with individual colors based on status
  const generatePathSegments = () => {
    if (nodePositions.length < 2) return [];

    const segments = [];

    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];

      // Determine segment color based on nodes' status
      let segmentColor;
      if (curr.node.status === 'locked') {
        segmentColor = style.pathColor.locked;
      } else if (curr.node.status === 'completed') {
        segmentColor = style.pathColor.complete;
      } else {
        segmentColor = style.pathColor.available;
      }

      // Create path segment
      let pathData;
      if (style.pathStyle === 'helix') {
        const controlX = (prev.x + curr.x) / 2;
        const controlY = (prev.y + curr.y) / 2;
        pathData = `M ${prev.x} ${prev.y} Q ${controlX} ${controlY}, ${curr.x} ${curr.y}`;
      } else {
        pathData = `M ${prev.x} ${prev.y} L ${curr.x} ${curr.y}`;
      }

      segments.push({
        id: `segment-${i}`,
        path: pathData,
        color: segmentColor,
        animated: curr.node.status === 'available' && prev.node.status === 'completed'
      });
    }

    return segments;
  };

  const pathSegments = generatePathSegments();
  const viewportHeight = (nodePositions.length * 140) + 120;

  return (
    <svg
      width={viewportWidth}
      height={viewportHeight}
      className="w-full"
      style={{ overflow: 'visible' }}
    >
      {/* Define gradients for nodes */}
      <defs>
        <linearGradient id="biology-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="chemistry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      {/* Draw path segments */}
      {pathSegments.map((segment, index) => (
        <motion.path
          key={segment.id}
          d={segment.path}
          stroke={segment.color}
          strokeWidth={style.pathWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: segment.animated ? [0.5, 1, 0.5] : 1
          }}
          transition={{
            pathLength: { duration: 0.5, delay: index * 0.1 },
            opacity: segment.animated ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : { duration: 0.3 }
          }}
          strokeDasharray={segment.color === style.pathColor.locked ? "5,5" : "none"}
        />
      ))}

      {/* Draw nodes */}
      {nodePositions.map((position, index) => {
        const node = position.node;
        const nodeSize = node.type === 'boss' ? 70 : node.type === 'mini-boss' ? 60 : 50;
        const isClickable = node.status !== 'locked';

        return (
          <g key={node.id}>
            {/* Node circle */}
            <motion.circle
              cx={position.x}
              cy={position.y}
              r={nodeSize / 2}
              fill={
                node.status === 'locked' ? '#E5E7EB' :
                node.status === 'completed' ? '#10B981' :
                node.type === 'boss' || node.type === 'mini-boss' ?
                  `url(#${subject}-gradient)` :
                  '#3B82F6'
              }
              stroke="#FFFFFF"
              strokeWidth={3}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                boxShadow: node.status === 'available' ? [
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  '0 0 0 10px rgba(59, 130, 246, 0)',
                ] : 'none'
              }}
              transition={{
                scale: { duration: 0.3, delay: index * 0.1 },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
              className={isClickable ? 'cursor-pointer' : ''}
              onClick={() => isClickable && onNodeClick && onNodeClick(node)}
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            />

            {/* Pulsing ring for available nodes */}
            {node.status === 'available' && (
              <motion.circle
                cx={position.x}
                cy={position.y}
                r={nodeSize / 2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Node icon/emoji */}
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={node.type === 'boss' ? 32 : node.type === 'mini-boss' ? 28 : 24}
              className="pointer-events-none select-none"
            >
              {node.icon}
            </text>

            {/* Checkmark overlay for completed nodes */}
            {node.status === 'completed' && (
              <motion.text
                x={position.x + nodeSize / 3}
                y={position.y - nodeSize / 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={20}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="pointer-events-none"
              >
                ✓
              </motion.text>
            )}

            {/* Lock icon for locked nodes */}
            {node.status === 'locked' && (
              <text
                x={position.x + nodeSize / 3}
                y={position.y - nodeSize / 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                className="pointer-events-none"
              >
                🔒
              </text>
            )}

            {/* Node label */}
            <text
              x={position.x}
              y={position.y + nodeSize / 2 + 20}
              textAnchor="middle"
              fontSize={12}
              fontWeight="600"
              fill="#374151"
              className="pointer-events-none select-none"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default PathVisualizer;
