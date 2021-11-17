import logo from './logo.svg';
import './App.css';
import React from "react";
import api from "./api"

function clickHandler(){
  console.log("clicked in Ping");
  api.getPing(function(res){
    console.log(res)
  })
}

function clickHandlerEth0(){
  console.log("clicked in get config");
  api.getConfig(function(res){
    console.log(res)
  })
}

function clickHandlerEth0Dhcp(){
  console.log("clicked in set dhcp");
  const config = {
    "method":"dhcp", 
  }
  api.setConfigDhcp(config, function(res){
    console.log(res)
  })
}

function App() {
  const [address, setAddress] = React.useState("");
  const [netmask, setNetmask] = React.useState("");
  const [gateway, setGateway] = React.useState("");
  const [servers, setServers] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`
      address: ${address}
      netMask: ${netmask}
      gateway: ${gateway}
      servers: ${servers}
    `);
    const config = {
      "method":"static", 
      "address": address, 
      "prefix_length":8, 
      "gateway": gateway, 
      "name_servers":[servers]
    }
    api.setConfigStatic(config, function(res){
      console.log(res)
    });
  }

  return (
    <div className="App">
      <button onClick={clickHandler}> Ping </button>
      <div className="App2">
        <button onClick={clickHandlerEth0}> Get Config Eth0 </button>  
      </div>
      <div className="App3">
        <button onClick={clickHandlerEth0Dhcp}> Set DHCP in ETH0 </button>  
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Netowrk</h1>

        <label>
          Address:
          <input
            name="address"
            type="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required />
        </label>

        <label>
          Netmask:
          <input
            name="netmask"
            type="netmask"
            value={netmask}
            onChange={e => setNetmask(e.target.value)}
            required />
        </label>

        <label>
          Gateway:
          <input
            name="gateway"
            type="gateway"
            value={gateway}
            onChange={e => setGateway(e.target.value)}
            required />
        </label>

        <label>
          Server:
          <input
            name="servers"
            type="servers"
            value={servers}
            onChange={e => setServers(e.target.value)}
            required />
        </label>

        <button>Submit</button>

    </form>
    </div>
  );
}

export default App;
