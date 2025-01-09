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
    <div className="">

      <h1 className="text-red-600">Search</h1>

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
              className=""
              key={index}
              onClick={() => handleItemClick(index)}
            >
              <h2 className="font-bold">{item.title}</h2>
              <p className="font-serif text-green-600">{item.description}</p>
              {status[index] && (
                <ol className="text-orange-600">
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




