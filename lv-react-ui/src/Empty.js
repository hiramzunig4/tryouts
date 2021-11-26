import { useState } from 'react'

import './App.css';
import React from "react"

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

function Empty() {
 
  //form validation
  const [ form, setForm ] = useState({netmask:"255.255.255.0"})
  const [ errors, setErrors ] = useState({})

  //radio selector
  const [radioselected, setRadioSelected] = React.useState("radiodhcp")
  const [stateradiodhcp, setStateRadioDhcp] = React.useState(true)
  const [stateradiostatic, setStateRadioStatic] = React.useState(false)

  //disable componets
  const [gatewaydisabled, setGatewayDisabled] = React.useState(true);
  const [netmaskdisabled, setSubnetmaskDisabled] = React.useState(true);
  const [ipaddressdisabled, setIpAddressdDisabled] = React.useState(true);
  const [Dnsprimarydisabled, setDnsprimaryDisabled] = React.useState(true);
  const [Dnssecondarydisabled, setDnsSecondaryDisabled] = React.useState(true);

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
  
  const findFormErrors = () => {
    const { address, netmask, gateway, dnsprimary, dnssecondary} = form
    const newErrors = {}
    //address error
    if ( !address || address === '' || !validateIPaddress(address)) newErrors.address = 'Enter a correct IP formart'
    if ( !netmask || netmask === '' || !validateIPaddress(netmask)) newErrors.netmask = 'Enter a correct netmask formart'
    if ( !gateway || gateway === '' || !validateIPaddress(gateway)) newErrors.gateway = 'Enter a correct gateway formart'
    console.log(dnsprimary)
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

   //manejo el estado los radios
  function clickSelectRadioButton(event)
  {
    console.log(event.target.id)
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

  
  const buttonClickSetConfig = (event) => {
    event.preventDefault()
    // get our new errors
    const newErrors = findFormErrors()
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      setErrors(newErrors)
    } else {
      console.log(form.address)
      console.log(form.netmask)
      // No errors! Put any logic here for the form submission!
      alert('Thank you for your feedback!')
    }
  }

  return (
      <Form>
        <h1>NETWORK</h1>
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
            id="IpAddress"
            placeholder="IP address"
            disabled={ipaddressdisabled} 
            onChange={e => setField('address', e.target.value)}
            isInvalid={ !!errors.address } 
          />
          <Form.Control.Feedback type='invalid'>{ errors.address }</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label align="right" column sm={2}>
            Subnet Mask
            </Form.Label>
            <Col sm={2} align="left">
            <Form.Control 
              //className="form-control-custom"
              as='select' 
              disabled={netmaskdisabled} 
              onChange={ e => setField('netmask', e.target.value) }
              isInvalid={ !!errors.netmask } 
            >
              <option value="255.255.255.0">255.255.255.0</option>
              <option value="255.255.0.0">255.255.0.0</option>
              <option value="255.0.0.0">255.0.0.0</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.netmask }</Form.Control.Feedback>
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
              disabled={gatewaydisabled} 
              onChange={ e => setField('gateway', e.target.value) }
              isInvalid={ !!errors.gateway } 
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
              id="dnsprimary"
              placeholder="Primary DNS"
              disabled={Dnsprimarydisabled} 
              onChange={ e => setField('dnsprimary', e.target.value) }
              isInvalid={ !!errors.dnsprimary } 
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
             id="dnssecondary"
             placeholder="Secondary DNS"
             disabled={Dnssecondarydisabled} 
             onChange={ e => setField('dnssecondary', e.target.value) }
             isInvalid={ !!errors.dnssecondary } 
            />
            <Form.Control.Feedback type='invalid'>{ errors.dnssecondary }</Form.Control.Feedback>
            </Col>
        </Form.Group>

        <Form.Group>
          <Col sm={{ span: 10, offset: 2 }}>
            <Stack direction="horizontal" gap={3}>
              <Button onClick={buttonClickSetConfig}>Set Config</Button>
              <Button>Get Config</Button>
              <Button>Ping</Button>
            </Stack>
          </Col>
        </Form.Group>

      </Form>
  )
} 

export default Empty;
