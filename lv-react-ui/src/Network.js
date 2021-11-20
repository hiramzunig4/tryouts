import './App.css';
import api from "./api"
import React from "react";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button';

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

function Network(){
  //State of input controls
  const [IpAddressDisabled, setIpAddressdDisabled] = React.useState(false);
  const [SubnetmaskDisabled, setSubnetmaskDisabled] = React.useState(false);
  const [GatewayDisabled, setGatewayDisabled] = React.useState(false);
  const [DnsprimaryDisabled, setDnsprimaryDisabled] = React.useState(false);
  const [DnssecondaryDisabled, setDnsSecondaryDisabled] = React.useState(false);
  
  const [address, setAddress] = React.useState("");
  const [netmask, setNetmask] = React.useState("");
  const [gateway, setGateway] = React.useState("");
  const [servers, setServers] = React.useState("");
  
  const [item, setItem] = React.useState("");

  function handleChange(event)
  {
    console.log(event.target.id)
    if(event.target.id === "radiodhcp"){
      setIpAddressdDisabled(true)
      setSubnetmaskDisabled(true)
      setGatewayDisabled(true)
      setDnsprimaryDisabled(true)
      setDnsSecondaryDisabled(true)
    }
    else{
      setIpAddressdDisabled(false)
      setSubnetmaskDisabled(false)
      setGatewayDisabled(false)
      setDnsprimaryDisabled(false)
      setDnsSecondaryDisabled(false)
    }
    setItem(event.target.id)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if(item === "radiostatic")
    {
      console.log(item)
      console.log(`
        address: ${address}
        netMask: ${netmask}
        gateway: ${gateway}
        servers: ${servers}
      `);
      const config = {
        "method":"static", 
        "address": `${address}`, 
        "prefix_length":8, 
        "gateway":  `${gateway}`, 
        "name_servers":[`${servers}`]
      }
      console.log(JSON.stringify(config))
      api.setConfigStatic(config, function(res){
        console.log(res)
      });
    }
    else{
      console.log(item)
      const config = {
        "method":"dhcp"
      }
      api.setConfigDhcp(config, function(res){
        console.log(res)
      });
    }
  }

  return (
    <Form>
        <fieldset>
            <Form.Group as={Row} className="mb-3">
            <Form.Label as="legend" column sm={1}>
                
            </Form.Label>
            <Col sm={2}>
                <Form.Check
                  type="radio"
                  label="Obtain an IP address automatically"
                  name="formHorizontalRadios"
                  id="radiodhcp"
                  onChange={handleChange}
                  value={item === "dhcp"}
                />
                <Form.Check
                  type="radio"
                  label="Use the following IP address:"
                  name="formHorizontalRadios"
                  id="radiostatic"
                  onChange={handleChange}
                  value={item === "static"}
                />
            </Col>
            </Form.Group>
        </fieldset>
        <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={1}>
            Ip address:
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="ipaddress" 
              id="IpAddress"
              disabled={IpAddressDisabled} 
              onChange={e => setAddress(e.target.value)}
              placeholder="IP address" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={1}>
            Subnet mask
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="subnetmask"
              onChange={e => setNetmask(e.target.value)}
              disabled={SubnetmaskDisabled}  
              placeholder="Subnet mask" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Default Gateway
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="gateway"
              onChange={e => setGateway(e.target.value)}
              disabled={GatewayDisabled}   
              placeholder="Gateway" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Preferred DNS server
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="preferreddns" 
              onChange={e => setServers(e.target.value)}
              disabled={DnsprimaryDisabled}   
              placeholder="DNS Primary" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Alternate DNS
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="alternatedns" 
              disabled={DnssecondaryDisabled} 
              placeholder="DNS Secondary" />
            </Col>
        </Form.Group>

        <Form.Group>
        <Col sm={{ span: 10, offset: 1 }}>
          <Stack direction="horizontal" gap={3}>
            <Button onClick={handleSubmit}>Set Config</Button>
            <Button onClick={clickHandler}>Ping</Button>
            <Button onClick={clickHandlerEth0}> Get Config </Button>
          </Stack>
          </Col>
        </Form.Group>
        </Form>
  );
}

export default Network;