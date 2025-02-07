import { useState } from "react";
import { Switch } from "@mui/material";
import data from "./data.json";
import SearchBar from './components/SearchBar';
import NetworkGraph from './components/NetworkGraph';
import ModuleList from './components/ModuleList';
import Legend from './components/Legend';
import { useGraphData } from './hooks/useGraphData';

function App() {
  const [showGraph, setShowGraph] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const graphData = useGraphData(data);

  const handleInputChange = (event, value) => {
    setSearchQuery(value ? value.title : "");
    
    if (showGraph && value) {
      const node = graphData.nodes.find(n => n.id === value.id);
      if (node) {
        setSelectedNode(node);
      }
    }
  };

  const handleItemClick = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          Studienführer
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <SearchBar 
          onInputChange={handleInputChange} 
          options={data}
          showGraph={showGraph}
        />
        <div className="flex items-center">
          <span className="mr-2">Netzwerk-Ansicht</span>
          <Switch 
            checked={showGraph} 
            onChange={(e) => setShowGraph(e.target.checked)} 
          />
        </div>
      </div>

      {showGraph ? (
        <div className="flex flex-col items-center">
          <NetworkGraph 
            graphData={graphData}
            onNodeClick={setSelectedNode}
            selectedNode={selectedNode}
          />
          <Legend />
        </div>
      ) : (
        <ModuleList
          data={data}
          searchQuery={searchQuery}
          onItemClick={handleItemClick}
          expandedItems={expandedItems}
        />
      )}
    </div>
  );
}

export default App;
