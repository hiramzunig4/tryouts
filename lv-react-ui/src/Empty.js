import { useState } from 'react'

import './App.css';
import api from "./api"
import React from "react"

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

function Empty() {
  //radio selector
  const [radioselected, setRadioSelected] = React.useState("radiodhcp")
  const [stateradiodhcp, setStateRadioDhcp] = React.useState(true)
  const [stateradiostatic, setStateRadioStatic] = React.useState(false)

  const [address, setAddress] = React.useState("");
  const [addressError, setAddressError] = React.useState("");
  const [netmask, setNetmask] = React.useState("255.255.255.0");
  const [netmaskError, setNetmaskError] = React.useState();
  const [gateway, setGateway] = React.useState("");
  const [gatewayError, setGatewayError] = React.useState("");
  const [someErrorInForm, setsomeErrorInForm] = React.useState(false);


  //disable componets
  const [gatewaydisabled, setGatewayDisabled] = React.useState(true);
  const [netmaskdisabled, setSubnetmaskDisabled] = React.useState(true);
  const [ipaddressdisabled, setIpAddressdDisabled] = React.useState(true);
  const [Dnsprimarydisabled, setDnsprimaryDisabled] = React.useState(true);
  const [Dnssecondarydisabled, setDnsSecondaryDisabled] = React.useState(true);

    //Response from yeico appliance
    const [responseString, setResponseString] = React.useState("")
  
    //Alerts
    const [isValid, setIsValid] = useState(false);
    const [isError, setIsError] = useState(false);
  
  function validateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
    return (false)  
  }  

  function formState(state)
  {
    setIpAddressdDisabled(state)
    setSubnetmaskDisabled(state)
    setGatewayDisabled(state)
    setDnsprimaryDisabled(state)
    setDnsSecondaryDisabled(state)
  }

  function dataToUi(key)
  {
    var addresswithpoints = `${JSON.stringify(key)}`.replace(/,/g,".")
    return addresswithpoints.replace(/[[\]']/g,"")
  }


   //manejo el estado los radios
  function clickSelectRadioButton(event)
  {
    if(event.target.id === "radiodhcp"){
      setStateRadioDhcp(true)
      setStateRadioStatic(false)
      formState(true)
    }
    else{
      setStateRadioDhcp(false)
      setStateRadioStatic(true)
      formState(false)
    }
    setRadioSelected(event.target.id)
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
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
  
        if(res.message.config.ipv4.method === "dhcp")
        {
          setRadioSelected("radiodhcp");
          setStateRadioDhcp(true)
          setStateRadioStatic(false)
          formState(true)
        }
        else //es estatica
        { 
          setRadioSelected("radiostatic");
          setStateRadioDhcp(false)
          setStateRadioStatic(true)
          formState(false)
        
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

          setAddress(dataToUi(res.message.config.ipv4.address))
          setNetmask(addressIp)
          setGateway(dataToUi(res.message.config.ipv4.gateway))
        }
      }
      //error en la respuesta
      else{
        setResponseString(`Get Config Error`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    })
  }
  
  const buttonClickSetConfig = (event) => {
    event.preventDefault()
    if ( !address || address === '' || !validateIPaddress(address))
    {
      setAddressError('Enter a correct IP formart')
      setsomeErrorInForm(true)
    } 
    if ( !netmask || netmask === '' || !validateIPaddress(netmask)) setNetmaskError('Enter a correct netmask formart')
    if ( !gateway || gateway === '' || !validateIPaddress(gateway)) setGatewayError('Enter a correct gateway formart')
    /*
    if(dnsprimary) 
    {
      if ( !dnsprimary || !validateIPaddress(dnsprimary)) newErrors.dnsprimary = 'Enter a correct dnsprimary formart'
    }
    if(dnssecondary)
    {
      if ( !dnssecondary || !validateIPaddress(dnssecondary)) newErrors.dnssecondary = 'Enter a correct dnssecondary formart'
    }
    */
    if(someErrorInForm)
    {
      return 
    }
    setAddressError('')
    setNetmaskError('')
    setGatewayError('')
    alert('Thank you for your feedback!')
  }

  return (
      <Form>
        <h1>NETWORK</h1>
        <Alert show={isValid} variant="success">
            {responseString}
        </Alert>
        <Alert show={isError} variant="danger">
              {responseString}
        </Alert>
        <Form.Group as={Row} className="mb-3">
          <Form.Label as="legend" column sm={2}>
          </Form.Label>
          <Col sm={3} align="left">
              <Form.Check
                type="radio"
                label="Obtain an IP address automatically"
                id="radiodhcp"
                onChange={clickSelectRadioButton}
                checked={stateradiodhcp}
              />
              <Form.Check
                type="radio"
                label="Use the following IP address:"
                id="radiostatic"
                onChange={clickSelectRadioButton}
                checked={stateradiostatic}
              />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-2">
          <Form.Label align="right" column sm={2}>
            IP Address
          </Form.Label>
          <Col sm={8}>
          <Form.Control 
            id="address"
            placeholder="IP address"
            value={address} 
            onChange={e => setAddress(e.target.value)}
            disabled={ipaddressdisabled} 
            isInvalid={ !!addressError} 
          />
          <Form.Control.Feedback type='invalid'>{ addressError }</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Select Netmask
            </Form.Label>
            <Col sm={2} align="left">
            <Form.Control 
              className="form-control-custom"
              as="select" 
              bsPrefix={"form-select"} //lo hace que salga la flecha para abajo
              //value={netmask} si lo pongo ya no puedo seleccionar otros
              disabled={netmaskdisabled} 
              onChange={ e => setNetmask(e.target.value) }
              isInvalid={ !!netmaskError } 
            >
              <option value="255.255.255.0">255.255.255.0</option>
              <option value="255.255.0.0">255.255.0.0</option>
              <option value="255.0.0.0">255.0.0.0</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ netmaskError }</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Default Gateway
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              id="gateway"
              placeholder="Gateway"
              value={gateway}
              disabled={gatewaydisabled} 
              onChange={  e => setGateway(e.target.value) }
              isInvalid={ !!gatewayError } 
           />
            <Form.Control.Feedback type='invalid'>{ gatewayError }</Form.Control.Feedback>
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
              id="dnsprimary"
              placeholder="Primary DNS"
              disabled={Dnsprimarydisabled} 
            />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
              Secondary
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
             id="dnssecondary"
             placeholder="Secondary DNS"
             disabled={Dnssecondarydisabled} 
            />
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
  )
} 

export default Empty;
