import { useState } from "react";
import "./App.css";
import data from "./data.json";
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';

function App() {
  const [status, setStatus] = useState({});
  const handleItemClick = (index) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  const [Query, setQuery] = useState("");

  const handleInputChange = (event, value) => {

    //setQuery(value?.title ?? ""); 
    setQuery(value? value.title : "");
    console.log(value);
  };

  return (
    <div className="container">

      <h1 className="text-red-600">Search</h1>


      <h1>Search</h1>
      <Autocomplete
      onChange={handleInputChange}
      placeholder="Combo box"
      options={data}
      getOptionLabel={option => option.title}
      sx={{ width: 300 }}

    />


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




