import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ForceGraph2D from 'react-force-graph-2d';
import { COLORS, GRAPH_CONFIG } from '../constants/colors';

const NetworkGraph = ({ graphData, onNodeClick, selectedNode }) => {
  const fgRef = useRef();

  const handleResize = () => {
    if (fgRef.current) {
      fgRef.current.centerAt(0, 0);
      fgRef.current.zoom(GRAPH_CONFIG.ZOOM_LEVEL);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedNode && fgRef.current) {
      setTimeout(() => {
        fgRef.current.centerAt(selectedNode.x, selectedNode.y, GRAPH_CONFIG.ANIMATION_DURATION);
        fgRef.current.zoom(GRAPH_CONFIG.ZOOM_LEVEL, GRAPH_CONFIG.ANIMATION_DURATION);
      }, 100);
    }
  }, [selectedNode]);

  const renderNode = (node, ctx, globalScale) => {
    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, GRAPH_CONFIG.NODE_SIZE, 0, 2 * Math.PI);
    
    if (selectedNode && node.id === selectedNode.id) {
      ctx.fillStyle = '#ff6b6b';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = node.type === 'Modul' ? COLORS.MODULE : COLORS.CONCEPT;
    }
    ctx.fill();

    // Node label
    const label = node.name;
    const fontSize = GRAPH_CONFIG.FONT_SIZE_BASE / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText(label, node.x, node.y + 8);
  };

  return (
    <div className="w-[90vw] h-[80vh] border border-gray-300 rounded-lg relative flex justify-center items-center">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={null}
        nodeRelSize={GRAPH_CONFIG.NODE_SIZE}
        linkWidth={GRAPH_CONFIG.LINK_WIDTH}
        linkColor="color"
        backgroundColor={COLORS.BACKGROUND}
        d3Force={('link', link => {
          link.distance(d => d.distance || GRAPH_CONFIG.LINK_DISTANCE).strength(0.5)
        })}
        nodeCanvasObject={renderNode}
        onNodeClick={(node) => {
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, GRAPH_CONFIG.ANIMATION_DURATION);
            fgRef.current.zoom(GRAPH_CONFIG.ZOOM_LEVEL, GRAPH_CONFIG.ANIMATION_DURATION);
          }
          onNodeClick(node);
        }}
        width={window.innerWidth * 0.85}
        height={window.innerHeight * 0.75}
        d3VelocityDecay={GRAPH_CONFIG.VELOCITY_DECAY}
      />
    </div>
  );
};

NetworkGraph.propTypes = {
  graphData: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    links: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  onNodeClick: PropTypes.func.isRequired,
  selectedNode: PropTypes.object
};

export default NetworkGraph; 