import './App.css';
import Button from 'react-bootstrap/Button'

import React from "react"

function handleDiscovery() {
  fetch("discovery")
  .then(res => res.json())
  .then(msg => console.log(msg))
}

function Utils() {
  return (
    <div>
      <Button onClick={handleDiscovery}>Discovery</Button>
    </div>
  );
} 

export default Utils;