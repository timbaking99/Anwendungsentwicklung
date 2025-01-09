import { useState } from "react";
import "./App.css";
import data from "./data.json";

function App() {
  const [status, setStatus] = useState({});
  const handleItemClick = (index) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  const [Query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="text-red-500">Search</h1>
      <input type="text" value={Query} onChange={handleInputChange} />
      {data.map(
        (item, index) =>
          item.title.toLowerCase().includes(Query.toLowerCase()) && (
            <div
              className="item"
              key={index}
              onClick={() => handleItemClick(index)}
            >
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {status[index] && (
                <ol>
                  {item.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )
      )}
    </div>
  );
}

export default App;
