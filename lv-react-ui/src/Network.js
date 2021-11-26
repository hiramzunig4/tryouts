import { useState } from 'react'

import './App.css';
import api from "./api"
import React from "react"

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

function Network(){
  //State of input controls
  const [GatewayDisabled, setGatewayDisabled] = React.useState(false);
  const [IpAddressDisabled, setIpAddressdDisabled] = React.useState(false);
  const [SubnetmaskDisabled, setSubnetmaskDisabled] = React.useState(false);
  const [DnsprimaryDisabled, setDnsprimaryDisabled] = React.useState(false);
  const [DnssecondaryDisabled, setDnsSecondaryDisabled] = React.useState(false);
  
  const [address, setAddress] = React.useState("");
  const [netmask, setNetmask] = React.useState("255.255.255.0");
  const [gateway, setGateway] = React.useState("");
  const [serverprimary, setServerPrimary] = React.useState("");
  const [serversecondary, setServerSecondary] = React.useState("")

  //Manage radiobutton
  const [item, setItem] = React.useState("radiodhcp")
  const [stateradiodhcp, setStateRadioDhcp] = React.useState(true)
  const [stateradiostatic, setStateRadioStatic] = React.useState(false)

  //Response from yeico appliance
  const [responseString, setResponseString] = React.useState("")
  
  //Alerts
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);

  const [customColorAddress, setCustomColorAddress] = React.useState("")
  const [customColorGateway, setCustomColorGateway] = React.useState("")

  function handleGetDropDownSelect(event)
  {
    console.log(event);
    setNetmask(event)
  }

  function clickRadioButton(event)
  {
    console.log(event.target.id)
    if(event.target.id === "radiodhcp"){
      //manejo el estado los radios
      setStateRadioDhcp(true)
      setStateRadioStatic(false)
      formState(true)
    }
    else{
      setStateRadioDhcp(false)
      setStateRadioStatic(true)
      formState(false)
    }
    setItem(event.target.id)
  }

  const buttonClickSetConfig = (event) => {
    event.preventDefault();
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

      //validate form before send
     if(!ValidateIPaddress(address))
     {
      setResponseString(`Enter a Correct IP Address`)
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 3000);
      return
     }

     if(!ValidateIPaddress(gateway))
     {
      setResponseString(`Enter a Correct Gateway`)
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 3000);
      return
     }

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
        if(res.result === "ok")
        {
          setResponseString(`Set Static Config Succes`)
          setIsValid(true)
          setTimeout(() => {
            setIsValid(false)
          }, 3000);
        }
        else{
            setResponseString(`Set Static Config Error`)
            setIsError(true)
            setTimeout(() => {
              setIsError(false)
            }, 3000);
          }
      });
    }
    else{
      console.log(item)
      const config = {
        "method":"dhcp"
      }
      api.setConfigDhcp(config, function(res){
        console.log(res)
        if(res.result === "ok")
        {
          setResponseString(`Set Static Config Succes`)
          setIsValid(true)
          setTimeout(() => {
            setIsValid(false)
          }, 3000);
        }
        else{
          setResponseString(`Set Static Config Error`)
          setIsError(true)
          setTimeout(() => {
            setIsError(false)
          }, 3000);
        }
      });
    }
  }

  function buttonClickPing(){
    console.log("clicked in Ping")
    api.getPing(function(res){
      console.log(`Respuesta del ping ${JSON.stringify(res)}`)
      if(res.result === "ok")
      {
        setResponseString(`Ping Response Success`)
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
      }
      else{
        setResponseString(`Ping Response Error`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    })
  }

  function buttonClickGetConfig(){
    console.log("clicked in get config");
    api.getConfig(function(res){
      console.log(res)
      if(res.result === "ok")
      {
        setResponseString(`Get Config Success`)
        setIsValid(true)
        //neta funciono?
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
  
        if(res.message.config.ipv4.method === "dhcp")
        {
          setItem("radiodhcp");
          setStateRadioDhcp(true)
          setStateRadioStatic(false)
          formState(true)
        }
        else{ 
          if(res.message.config.ipv4.method === "static")
          {
            setItem("radiostatic");
            setStateRadioDhcp(false)
            setStateRadioStatic(true)
            formState(false)
            setAddress(dataToUi(res.message.config.ipv4.address))
            var addressIp = "";
            switch(res.message.config.ipv4.prefix_length) {
              case 8:
                addressIp = "255.0.0.0"
                break;
              case 16:
                addressIp = "255.255.0.0"
                break;
              default:
                addressIp = "255.255.255.0"
            }
            setNetmask(addressIp)
            setGateway(dataToUi(res.message.config.ipv4.gateway))
            setServerPrimary(dataToUi(res.message.config.ipv4.name_servers[0]))
            if(res.message.config.ipv4.name_servers[1])
            {
              setServerSecondary(dataToUi(res.message.config.ipv4.name_servers[1]))
            }
          }
        }
      }
      else{
        setResponseString(`Get Config Error`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    })
  }

  function dataToUi(key)
  {
    var addresswithpoints = `${JSON.stringify(key)}`.replace(/,/g,".")
    return addresswithpoints.replace(/[[\]']/g,"")
  }

  function formState(state)
  {
    setIpAddressdDisabled(state)
    setSubnetmaskDisabled(state)
    setGatewayDisabled(state)
    setDnsprimaryDisabled(state)
    setDnsSecondaryDisabled(state)
  }

  function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
    return (false)  
  }  

  function ValidateInputForms(ipaddress, info, type) {  
    switch(type) {
      case "address":
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
          setCustomColorAddress("")
        }  
        else
        {
          setCustomColorAddress("form-control-custom")
          setResponseString(info)
          setIsError(true)
          setTimeout(() => {
            setIsError(false)
          }, 3000);
          return
        }
        break;
      case "gateway":
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
          setCustomColorGateway("")
        }  
        else
        {
          setCustomColorGateway("form-control-custom")
          setResponseString(info)
          setIsError(true)
          setTimeout(() => {
            setIsError(false)
          }, 3000);
          return
        }
        break;
      default:
        // code block
    }
  } 

  return (
    <Form noValidate>
     <Card.Title as="h1">NETWORK</Card.Title>
      <Alert show={isValid} variant="success">
            {responseString}
      </Alert>
      <Alert show={isError} variant="danger">
            {responseString}
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
                  onChange={clickRadioButton}
                  checked={stateradiodhcp}
                />
                <Form.Check
                  type="radio"
                  label="Use the following IP address:"
                  name="formHorizontalRadios"
                  id="radiostatic"
                  onChange={clickRadioButton}
                  checked={stateradiostatic}
                />
            </Col>
            </Form.Group>
        </fieldset>
        <Form.Group as={Row} className="mb-2">
            <Form.Label align="right" column sm={2}>
            IP Address
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              className={customColorAddress}
              id="IpAddress"
              disabled={IpAddressDisabled} 
              value={address} 
              onChange={e => setAddress(e.target.value)}
              onBlurCapture={e => ValidateInputForms(address, "Enter a Correct IP Address", "address")}
              placeholder="IP address" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Subnet Mask
            </Form.Label>
            <Col sm={1} align="left">
            <DropdownButton
              title={netmask}
              id="dropdown-menu-align-right"
              variant="secondary"
              onSelect={handleGetDropDownSelect}
              disabled={SubnetmaskDisabled}
              >
                <Dropdown.Item eventKey="255.255.255.0">255.255.255.0</Dropdown.Item>
                <Dropdown.Item eventKey="255.255.0.0">255.255.0.0</Dropdown.Item>
                <Dropdown.Item eventKey="255.0.0.0">255.0.0.0</Dropdown.Item>
            </DropdownButton>
            </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Default Gateway
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              className={customColorGateway}
              type="gateway"
              onChange={e => setGateway(e.target.value)}
              disabled={GatewayDisabled}  
              value={gateway} 
              onBlurCapture={e => ValidateInputForms(gateway, "Enter a Correct Gateway", "gateway")}
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
              value={serverprimary}  
              placeholder="Primary DNS" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Secondary
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              type="alternatedns" 
              onChange={e => setServerSecondary(e.target.value)}
              disabled={DnssecondaryDisabled} 
              value={serversecondary} 
              placeholder="Secondary DNS" />
            </Col>
        </Form.Group>

        <Form.Group>
        <Col sm={{ span: 10, offset: 2 }}>
          <Stack direction="horizontal" gap={3}>
            <Button onClick={buttonClickSetConfig}>Set Config</Button>
            <Button onClick={buttonClickGetConfig}>Get Config</Button>
            <Button onClick={buttonClickPing}>Ping</Button>
          </Stack>
          </Col>
        </Form.Group>
      </Form>
  );
}

export default Network;