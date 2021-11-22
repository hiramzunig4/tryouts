import { useState, useEffect } from 'react'

import './App.css';
import api from "./api"
import React from "react"

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

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
  const [serverprimary, setServerPrimary] = React.useState("");
  const [serversecondary, setServerSecondary] = React.useState("")

  //Manage radiobutton
  const [item, setItem] = React.useState("")

  //Control Modal Ping
  const [showpingmodal, setShowPingModal] = useState(false)
  const [responsePing, setResponsePing] = React.useState("")
  const handleClosePing = () => setShowPingModal(false)
  
    //Control Modal Config
    const [showconfigmodal, setShowConfigModal] = useState(false)
    const [responseConfig, setResponseConfig] = React.useState("")
    const handleCloseConfig = () => setShowConfigModal(false)

    //Alerts
    const [isValid, setIsValid] = useState(false);

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
        server primary: ${serverprimary}
        server secondary: ${serversecondary}
      `);

      var maskNodes = netmask.match(/(\d+)/g);
      var cidr = 0;
      for(var i in maskNodes)
      {
        cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
      }
      console.log(cidr)

      var config=""
      if (serversecondary === "") {
        config = {
          "method":"static", 
          "address": `${address}`, 
          "prefix_length":cidr, 
          "gateway":  `${gateway}`, 
          "name_servers":[`${serverprimary}`]
        }
      }
      else{
        config = {
          "method":"static", 
          "address": `${address}`, 
          "prefix_length":cidr, 
          "gateway":  `${gateway}`, 
          "name_servers":[`${serverprimary}`,`${serversecondary}`]
        }
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

  function clickHandler(){
    console.log("clicked in Ping")
    api.getPing(function(res){
      console.log(res)
      setResponsePing(`response ${JSON.stringify(res)}`)
      //setShowPingModal(true)
      setIsValid(true)
      //neta funciono?
      setTimeout(() => {
        setIsValid(false)
      }, 3000);
    })
  }

  function clickHandlerEth0(){
    console.log("clicked in get config");
    api.getConfig(function(res){
      console.log(res.message.config.ipv4)
      setResponseConfig(`response ${JSON.stringify(res.message.config.ipv4)}`)
      setShowConfigModal(true)
    })
  }

  return (
    <Form>
      
      <Alert show={isValid} animationType={"slide"} variant="success">
          <Alert.Heading> Response </Alert.Heading>
          <p>
            {responsePing}
          </p>
          <hr />
          <p className="mb-3">
            Whenever you need to, be sure to use margin utilities to keep things nice
            and tidy.
          </p>
      </Alert>

        <fieldset>
            <Form.Group as={Row} className="mb-3">
            <Form.Label as="legend" column sm={2}>
            </Form.Label>
            <Col sm={3} align="left">
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
            <Form.Label align="right" column sm={2}>
            Ip address
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="ipaddress" 
              id="IpAddress"
              disabled={IpAddressDisabled} 
              onChange={e => setAddress(e.target.value)}
              placeholder="IP address" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Subnet mask
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="subnetmask"
              onChange={e => setNetmask(e.target.value)}
              disabled={SubnetmaskDisabled}  
              placeholder="Subnet mask" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Default Gateway
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="gateway"
              onChange={e => setGateway(e.target.value)}
              disabled={GatewayDisabled}   
              placeholder="Gateway" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
              Set DNS Servers:
            </Form.Label>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Primary
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="preferreddns" 
              onChange={e => setServerPrimary(e.target.value)}
              disabled={DnsprimaryDisabled}   
              placeholder="DNS Primary" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Alternate
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="alternatedns" 
              onChange={e => setServerSecondary(e.target.value)}
              disabled={DnssecondaryDisabled} 
              placeholder="DNS Secondary" />
            </Col>
        </Form.Group>

        <Form.Group>
        <Col sm={{ span: 10, offset: 2 }}>
          <Stack direction="horizontal" gap={3}>
            <Button onClick={handleSubmit}>Set Config</Button>
            <Button onClick={clickHandlerEth0}> Get Config </Button>
            <Button onClick={clickHandler}>Ping</Button>
          </Stack>
          </Col>
        </Form.Group>

        <Modal show={showpingmodal} onHide={handleClosePing}>
          <Modal.Header closeButton>
            <Modal.Title>Ping</Modal.Title>
          </Modal.Header>
          <Modal.Body>{responsePing}</Modal.Body>
          <Modal.Footer>
            <Button autoFocus variant="primary" onClick={handleClosePing}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showconfigmodal} onHide={handleCloseConfig}>
          <Modal.Header closeButton>
            <Modal.Title>Config</Modal.Title>
          </Modal.Header>
          <Modal.Body>{responseConfig}</Modal.Body>
          <Modal.Footer>
            <Button autoFocus variant="primary" onClick={handleCloseConfig}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
  );
}

export default Network;