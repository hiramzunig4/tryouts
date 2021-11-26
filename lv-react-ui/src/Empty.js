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

  const [ form, setForm ] = useState({address:""})
  const [ errors, setErrors ] = useState({})

  //disable componets
  const [ipaddressdisabled, setIpAddressdDisabled] = React.useState(true);

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
          console.log(dataToUi(res.message.config.ipv4.address))
          form.address = dataToUi(res.message.config.ipv4.address)
        }
        setResponseString(`Get Config Success`)
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
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
    // get our new errors
    const newErrors = findFormErrors()
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      setErrors(newErrors)
    } else {
      // No errors! Put any logic here for the form submission!
      alert('Thank you for your feedback!')
    }
  }
  
  const findFormErrors = () => {
    const { address } = form
    const newErrors = {}
    // name errors
    if ( !address || address === '' || !validateIPaddress(address)) newErrors.address = 'Enter a correct address formart'


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