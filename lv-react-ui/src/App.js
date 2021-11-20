import React, { useState } from 'react';

import Nav from 'react-bootstrap/Nav';
import Network from './Network';
import Database from './Database';
import Empty from './Empty';
import './App.css';

function App() {
  
  const [tab, setTab] = useState("network");

  function handleSelect(eventKey) {
    console.log(eventKey)
    setTab(eventKey)
  }

  function renderContent(eventKey) {
    switch(eventKey) {
      case "network":
        return  (<Network/>);
      case "database":
        return  (<Database/>);
      default:
        return  (<Empty/>);
    }
  }

  return (
    <div className="App">
      <Nav variant="pills" activeKey={tab} onSelect={handleSelect}>
        <Nav.Item>
          <Nav.Link eventKey="network">Network</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="database">Database</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="utils">Utils</Nav.Link>
        </Nav.Item>
      </Nav>    
     {renderContent(tab)}
    </div>
  );
}

export default App;
