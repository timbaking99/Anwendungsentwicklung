import { useState, useRef, useEffect } from "react";
import "./App.css";
import data from "./data.json";
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
    setQuery(value? value.title : "");
    if (value) {
      // Fokussiere auf den ausgewählten Knoten
      const node = graphData.nodes.find(n => n.id === value.id);
      if (node && fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(2.5, 1000);
      }
    }
  };

  // Graph Daten generieren
  const graphData = {
    nodes: data.map(item => ({
      id: item.id,
      name: item.title,
      difficulty: item.difficulty || 'Mittel', // Fallback für fehlende difficulty
      description: item.description || item.source, // Nutze source als Beschreibung
      steps: item.steps || [], // Leeres Array als Fallback
      val: 6 // Einheitliche Größe für alle Knoten
    })),
    links: data.flatMap(item => 
      (item.relatedTutorials || item.relatedmodules || []).map(relatedId => ({
        source: item.id,
        target: relatedId,
        color: '#94a3b8'
      }))
    )
  };

  // Node Styling - Farben nach Kategorien
  const getNodeColor = (node) => {
    switch(node.category) {
      case 'Mathematik': return '#86efac'; // Grün
      case 'Mechanik': return '#fde047';   // Gelb
      case 'Wirtschaft': return '#f87171'; // Rot
      case 'Informatik': return '#60a5fa'; // Blau
      default: return '#d8b4fe';           // Lila für Sonstige
    }
  };

  // Funktion zum Zentrieren des Graphen
  const handleResize = () => {
    if (fgRef.current) {
      fgRef.current.centerAt(0, 0);
      fgRef.current.zoom(2.5);
    }
  };

  // Initialisierung und Resize-Handler
  useEffect(() => {
    if (showGraph) {
      handleResize();
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showGraph]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Suchleiste mit Autocomplete */}
        <div className="flex-grow mr-4">
          <Autocomplete
            onChange={handleInputChange}
            placeholder="Suchen..."
            options={data}
            getOptionLabel={option => option.title}
            sx={{ 
              width: '100%',
              '& .MuiInputBase-root': {
                padding: '8px',
                borderRadius: '0.375rem',
              }
            }}
          />
        </div>
        
        {/* Switch Button */}
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch 
                checked={showGraph} 
                onChange={(e) => setShowGraph(e.target.checked)} 
              />
            } 
            label="Netzwerk-Ansicht"
          />
        </FormGroup>
      </div>

      {showGraph ? (
        <div className="flex justify-center items-center">
          <div 
            style={{ 
              width: '90vw',              // 90% der Bildschirmbreite
              height: '80vh',             // 80% der Bildschirmhöhe
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              position: 'relative',
              margin: '0 auto'            // horizontale Zentrierung
            }}
            className="flex justify-center items-center"  // Flex-Zentrierung
          >
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={getNodeColor}
              nodeRelSize={6}
              linkWidth={1.5}
              linkColor="color"
              backgroundColor="#ffffff"
              onNodeClick={(node) => {
                setSelectedNode(node);
                if (fgRef.current) {
                  fgRef.current.centerAt(node.x, node.y, 1000);
                  fgRef.current.zoom(2.5, 1000);
                }
              }}
              onNodeRightClick={() => setSelectedNode(null)}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              onEngineStop={() => {
                handleResize();
              }}
              width={window.innerWidth * 0.85}    // Etwas kleiner für Margins
              height={window.innerHeight * 0.75}   // Angepasste Höhe
              d3Force={('center', () => {})}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                ctx.fillStyle = getNodeColor(node);
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                ctx.fill();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000000';
                ctx.fillText(label, node.x, node.y);
              }}
            />
            
            {/* Info Panel mit angepasster Position */}
            {selectedNode && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-10">
                <h3 className="font-bold text-lg mb-2">{selectedNode.name}</h3>
                <p className="text-gray-600 mb-2">Quelle: {selectedNode.source}</p>
                <div className="mb-2">
                  <span className="font-semibold">Kategorie: </span>
                  <span className={`px-2 py-1 rounded ${
                    selectedNode.category === 'Mathematik' ? 'bg-green-200' :
                    selectedNode.category === 'Mechanik' ? 'bg-yellow-200' :
                    selectedNode.category === 'Wirtschaft' ? 'bg-red-200' :
                    selectedNode.category === 'Informatik' ? 'bg-blue-200' :
                    'bg-purple-200'
                  }`}>
                    {selectedNode.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-red-600">Module</h1>
          {data.map(
            (item, index) =>
              item.title.toLowerCase().includes(Query.toLowerCase()) && (
                <div
                  className="p-4 mb-4 border rounded hover:shadow-lg transition-shadow"
                  key={index}
                  onClick={() => handleItemClick(index)}
                >
                  <h2 className="font-bold">{item.title}</h2>
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




