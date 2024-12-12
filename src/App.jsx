import { useState } from 'react'
import './App.css'
import data from "./data.json"

function App() { 
  return (
    <div className='container'>
      {data.map((item, index) => (
      <div className='item'>
        <h2 key={index}>{item.title}</h2>
        <p>{item.description}</p>
      </div>
      ))}
    </div>
  );
}

export default App
