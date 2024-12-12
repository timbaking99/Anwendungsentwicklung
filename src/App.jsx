import { useState } from 'react'
import './App.css'
import data from "./data.json"

function App() { 
  return (
    <div>
      {data.map((item, index) => (
        <h2 key={index}>{item.title}</h2>
      ))}
    </div>
  );
}

export default App
