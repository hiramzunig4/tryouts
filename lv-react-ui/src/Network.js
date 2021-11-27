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

function Network() {
  //radio selector
  const [radioselected, setRadioSelected] = React.useState("radiodhcp")
  const [stateradiodhcp, setStateRadioDhcp] = React.useState(true)
  const [stateradiostatic, setStateRadioStatic] = React.useState(false)

  const [ form, setForm ] = useState({address:"", gateway:"", netmask:"255.255.255.0", dnsprimary:"", dnssecondary:""})
  const [ errors, setErrors ] = useState({})

  //disable componets
  const [ipaddressdisabled, setIpAddressdDisabled] = React.useState(true);
  const [gatewaydisabled, setGatewayDisabled] = React.useState(true);
  const [netmaskdisabled, setNetmaskDisabled] = React.useState(true);
  const [dnsprimarydisabled, setDnsPrimaryDisabled] = React.useState(true);
  const [dnssecondarydisabled, setDnsSecondaryDisabled] = React.useState(true);

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
    setGatewayDisabled(state)
    setNetmaskDisabled(state)
    setDnsPrimaryDisabled(state)
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
    console.log(radioselected)
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
          form.address = dataToUi(res.message.config.ipv4.address)
          form.gateway = dataToUi(res.message.config.ipv4.gateway)
          form.netmask = addressIp
          if(res.message.config.ipv4.name_servers.length > 0)
          {
            console.log("al menos tiene un dns")
            form.dnsprimary = dataToUi(res.message.config.ipv4.name_servers[0])
          }
          
          if(res.message.config.ipv4.name_servers.length > 1)
          {
            console.log("tiene dos dns")
            form.dnssecondary = dataToUi(res.message.config.ipv4.name_servers[1])
          }
        }
        setResponseString(`Get Config Success`)
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
      }
      else{ //error en la respuesta
        setResponseString(`Get Config Error`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    })
  }

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    // Check and see if errors exist, and remove them from the error object:
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }
  
  const buttonClickSetConfig = (event) => {
    event.preventDefault()
    //la configuracion es estatica
    if(radioselected === "radiostatic"){
      // get our new errors
      const newErrors = findFormErrors()
      // Conditional logic:
      if ( Object.keys(newErrors).length > 0 ) {
        // We got errors!
        setErrors(newErrors)
      } 
      else { 
        // No errors! Put any logic here for the form submission!
        console.log(`
          address: ${form.address}
          gateway: ${form.gateway}
          netmask: ${form.netmask}
          server primary: ${form.dnsprimary}
          server secondary: ${form.dnssecondary}
        `)
        var maskNodes = form.netmask.match(/(\d+)/g);
        var cidr = 0;
        for(var i in maskNodes)
        {
          cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
        }
        
        var config=""
        var dnsserver = []
        //si los dos estan en blanco se envian sin pedos  
        //"name_servers":[`${dnsserver[0]}`,`${dnsserver[1]}`]
        //"name_servers":[]  cuando no hay nada en los dos
        //"name_servers":[`${dnsserver[0]}`]
        if(!form.dnsprimary && !form.dnssecondary)
        {
          config = {
            "method":"static", 
            "address": `${form.address}`, 
            "prefix_length":cidr, 
            "gateway":  `${form.gateway}`, 
            "name_servers":[]
          }
        }
        if(form.dnsprimary && !form.dnssecondary)
        {
          dnsserver.push(`${form.dnsprimary}`)
          config = {
            "method":"static", 
            "address": `${form.address}`, 
            "prefix_length":cidr, 
            "gateway":  `${form.gateway}`, 
            "name_servers":[`${dnsserver[0]}`]
          }
        }
        if(form.dnsprimary && form.dnssecondary)
        {
          dnsserver.push(`${form.dnsprimary}`)
          dnsserver.push(`${form.dnssecondary}`)
          config = {
            "method":"static", 
            "address": `${form.address}`, 
            "prefix_length":cidr, 
            "gateway":  `${form.gateway}`, 
            "name_servers":[`${dnsserver[0]}`,`${dnsserver[1]}`]
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
    }
  else{
    console.log(radioselected)
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
  
  const findFormErrors = () => {
    const { address, gateway, netmask, dnsprimary, dnssecondary} = form
    const newErrors = {}
    // name errors
    if ( !address || address === '' || !validateIPaddress(address)) newErrors.address = 'Enter a correct address formart'
    if ( !gateway || gateway === '' || !validateIPaddress(gateway)) newErrors.gateway = 'Enter a correct gateway formart'
    if ( !netmask || netmask === '' || !validateIPaddress(netmask)) newErrors.netmask = 'Enter a correct netmask formart'
    if(dnsprimary) 
    {
      if ( !dnsprimary || !validateIPaddress(dnsprimary)) newErrors.dnsprimary = 'Enter a correct dnsprimary formart'
    }
    if(dnssecondary) 
    {
      if ( !dnssecondary || !validateIPaddress(dnssecondary)) newErrors.dnssecondary = 'Enter a correct dnssecondary formart'
    }
    return newErrors
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
            placeholder="IP address"
            onChange={ e => setField('address', e.target.value) }
            isInvalid={ !!errors.address }
            disabled={ipaddressdisabled} 
            value={form.address}
          />
          <Form.Control.Feedback type='invalid'>{ errors.address }</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Select Netmask
            </Form.Label>
            <Col xs={2} align="left">
            <Form.Control 
              className="form-control-custom" //hace que el color se vea gris en el css custom
              as="select" 
              bsPrefix={"form-select"} //lo hace que salga la flecha para abajo
              onChange={ e => setField('netmask', e.target.value) }
              isInvalid={ !!errors.netmask }
              disabled={netmaskdisabled} 
              value={form.netmask}
            >
              <option value="255.255.255.0">255.255.255.0</option>
              <option value="255.255.0.0">255.255.0.0</option>
              <option value="255.0.0.0">255.0.0.0</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{  errors.netmask }</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Default Gateway
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              placeholder="Gateway"
              onChange={  e => setField('gateway', e.target.value) }
              isInvalid={ !!errors.gateway } 
              disabled={gatewaydisabled} 
              value={form.gateway}
            />
            <Form.Control.Feedback type='invalid'>{ errors.gateway }</Form.Control.Feedback>
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
              placeholder="Primary DNS"
              onChange={  e => setField('dnsprimary', e.target.value) }
              isInvalid={ !!errors.dnsprimary } 
              disabled={dnsprimarydisabled} 
              value={form.dnsprimary}
            />
            <Form.Control.Feedback type='invalid'>{ errors.dnsprimary }</Form.Control.Feedback>
            </Col>
        </Form.Group>
        
        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Secondary
            </Form.Label>
            <Col sm={8}>
            <Form.Control 
              placeholder="Secondary DNS"
              onChange={  e => setField('dnssecondary', e.target.value) }
              isInvalid={ !!errors.dnssecondary } 
              disabled={dnssecondarydisabled} 
              value={form.dnssecondary}
            />
            <Form.Control.Feedback type='invalid'>{ errors.dnssecondary }</Form.Control.Feedback>
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

export default Network;