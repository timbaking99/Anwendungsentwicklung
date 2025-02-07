import { useState, useRef, useEffect } from "react";
import data from "./data.json";
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import { Switch } from "@mui/material";
import ForceGraph2D from 'react-force-graph-2d';

function App() {
  const [showGraph, setShowGraph] = useState(false);
  const [status, setStatus] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const fgRef = useRef();
  
  const handleItemClick = (index) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  const [Query, setQuery] = useState("");

  const handleInputChange = (event, value) => {
    setQuery(value ? value.title : "");
    if (value) {
      const node = graphData.nodes.find(n => n.id === value.id);
      if (node && fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2.5, 1000);
      }
    }
  };

  const graphData = {
    nodes: data.map(item => ({
      id: item.id,
      name: item.title,
      type: item.type,
      difficulty: item.difficulty || 'Mittel',
      description: item.description || item.source,
      steps: item.steps || [],
      val: 6
    })),
    links: data.flatMap(item => 
      (item.relatedTutorials || item.relatedmodules || []).map(relatedId => ({
        source: item.id,
        target: relatedId,
        color: '#94a3b8',
        distance: 150
      }))
    )
  };

  const handleResize = () => {
    if (fgRef.current) {
      fgRef.current.centerAt(0, 0);
      fgRef.current.zoom(2.5);
    }
  };

  useEffect(() => {
    if (showGraph) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showGraph]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-grow mr-4">
          <Autocomplete
            onChange={handleInputChange}
            placeholder="Suchen..."
            options={data}
            getOptionLabel={option => option.title}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Netzwerk-Ansicht</span>
          <Switch checked={showGraph} onChange={(e) => setShowGraph(e.target.checked)} />
        </div>
      </div>
      {showGraph ? (
        <div className="flex flex-col items-center">
          <div className="w-[90vw] h-[80vh] border border-gray-300 rounded-lg relative flex justify-center items-center">
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeLabel={null}
              nodeRelSize={6}
              linkWidth={1.5}
              linkColor="color"
              backgroundColor="#ffffff"
              d3Force={('link', link => {
                link.distance(d => d.distance || 150).strength(0.5)
              })}
              nodeCanvasObject={(node, ctx, globalScale) => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = node.type === 'Modul' ? '#1f77b4' : '#2ecc71';
                ctx.fill();

                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillStyle = 'black';
                ctx.fillText(label, node.x, node.y + 8);
              }}
              onNodeClick={(node) => {
                setSelectedNode(node);
                if (fgRef.current) {
                  fgRef.current.centerAt(node.x, node.y, 1000);
                  fgRef.current.zoom(2.5, 1000);
                }
              }}
              onNodeRightClick={() => setSelectedNode(null)}
              width={window.innerWidth * 0.85}
              height={window.innerHeight * 0.75}
              d3VelocityDecay={0.3}
            />
          </div>
          
          {/* Legende */}
          <div className="mt-4 flex items-center justify-center gap-8 p-4 bg-white border border-gray-300 rounded-lg">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#1f77b4] mr-2"></div>
              <span>Module</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#2ecc71] mr-2"></div>
              <span>Konzepte</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-red-600 text-xl font-bold">Module</h1>
          {data.map((item, index) =>
            item.title.toLowerCase().includes(Query.toLowerCase()) && (
              <div
                className="p-4 mb-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                key={index}
                onClick={() => handleItemClick(index)}
              >
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-gray-600">Quelle: {item.source}</p>
                {status[index] && (
                  <div className="mt-2">
                    <p className="font-semibold">Verwandte Module:</p>
                    <ul className="list-disc list-inside text-blue-600">
                      {item.relatedmodules.map((module, moduleIndex) => (
                        <li key={moduleIndex}>{module}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

export default App;
