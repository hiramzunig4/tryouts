import { useState } from 'react'

import './App.css';
import api from "./api"
import React from "react"
import Validation from './Validation'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

function Network() {
  //radio selector
  const [radioSelected, setRadioSelected] = React.useState("radiodhcp")
  const [stateRadioDhcp, setStateRadioDhcp] = React.useState(true)
  const [stateRadioStatic, setStateRadioStatic] = React.useState(false)

  //Errors
  const [form, setForm] = useState({ address: "", gateway: "", netmask: "255.255.255.0", dnsprimary: "", dnssecondary: "" })
  const [errors, setErrors] = useState({ address: "", gateway: "", netmask: "", dnsprimary: "", dnssecondary: "" })

  //disable componets
  const [ipAddressDisabled, setIpAddressdDisabled] = React.useState(true);
  const [gatewayDisabled, setGatewayDisabled] = React.useState(true);
  const [netmaskDisabled, setNetmaskDisabled] = React.useState(true);
  const [dnsPrimaryDisabled, setDnsPrimaryDisabled] = React.useState(true);
  const [dnsSecondaryDisabled, setDnsSecondaryDisabled] = React.useState(true);

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

  function setDisabledComponents(state) {
    setIpAddressdDisabled(state)
    setGatewayDisabled(state)
    setNetmaskDisabled(state)
    setDnsPrimaryDisabled(state)
    setDnsSecondaryDisabled(state)
  }

  function parseIP(key) {
    var addresswithpoints = `${JSON.stringify(key)}`.replace(/,/g, ".")
    return addresswithpoints.replace(/[[\]']/g, "")
  }

  //manage state radios
  function ButtonSelectRadio_Click(event) {
    if (event.target.id === "radiodhcp") {
      setStateRadioDhcp(true)
      setStateRadioStatic(false)
      setDisabledComponents(true)
    }
    else {
      setStateRadioDhcp(false)
      setStateRadioStatic(true)
      setDisabledComponents(false)
    }
    setRadioSelected(event.target.id)
    console.log(radioSelected)
  }

  function ButtonPing_Click() {
    console.log("clicked in Ping")
    api.getNetworkPing(function (res) {
      console.log(`Respuesta del ping ${JSON.stringify(res)}`)
      if (res.result === "ok") {
        setResponseString(`Ping Response Success`)
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
      }
      else {
        setResponseString(`Ping Response Error`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    })
  }

  function ButtonGetNetworkConfig_Click() {
    console.log("clicked in get config");
    api.getNetworkConfig(function (res) {
      console.log(res)
      if (res.result === "ok") {
        if (res.message.config.ipv4.method === "dhcp") {
          setRadioSelected("radiodhcp");
          setStateRadioDhcp(true)
          setStateRadioStatic(false)
          setDisabledComponents(true)
        }
        else //is static
        {
          setRadioSelected("radiostatic");
          setStateRadioDhcp(false)
          setStateRadioStatic(true)
          setDisabledComponents(false)

          var addressIp = "";
          switch (res.message.config.ipv4.prefix_length) {
            case 8:
              addressIp = "255.0.0.0"
              break;
            case 16:
              addressIp = "255.255.0.0"
              break;
            default:
              addressIp = "255.255.255.0"
          }
          form.address = parseIP(res.message.config.ipv4.address)
          form.gateway = parseIP(res.message.config.ipv4.gateway)
          form.netmask = addressIp
          if (res.message.config.ipv4.name_servers.length === 0) {
            form.dnsprimary = ""
            form.dnssecondary = ""
          }
          if (res.message.config.ipv4.name_servers.length === 1) {
            form.dnsprimary = parseIP(res.message.config.ipv4.name_servers[0])
            form.dnssecondary = ""
          }
          if (res.message.config.ipv4.name_servers.length === 2) {
            form.dnsprimary = parseIP(res.message.config.ipv4.name_servers[0])
            form.dnssecondary = parseIP(res.message.config.ipv4.name_servers[1])
          }
        }
        setResponseString(`Get Config Success`)
        setErrors({ address: "", gateway: "", netmask: "", dnsprimary: "", dnssecondary: "" })
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
      }
      else { //is error in the response
        setResponseString(`Get Config Error`)
        setErrors({ address: "", gateway: "", netmask: "", dnsprimary: "", dnssecondary: "" })
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
    if (!!errors[field]) setErrors({
      ...errors,
      [field]: null
    })
  }

  const ButtonSetNetworkConfig_Click = (event) => {
    event.preventDefault()
    //the config is static
    if (radioSelected === "radiostatic") {
      // get our new errors
      const newErrors = findFormErrors()
      // Conditional logic:
      if (Object.keys(newErrors).length > 0) {
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
        for (var i in maskNodes) {
          cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
        }

        var config = ""
        var dnsserver = []
        if (!form.dnsprimary && !form.dnssecondary) {
          config = {
            "method": "static",
            "address": `${form.address}`,
            "prefix_length": cidr,
            "gateway": `${form.gateway}`,
            "name_servers": []
          }
        }
        if (form.dnsprimary && !form.dnssecondary) {
          dnsserver.push(`${form.dnsprimary}`)
          config = {
            "method": "static",
            "address": `${form.address}`,
            "prefix_length": cidr,
            "gateway": `${form.gateway}`,
            "name_servers": [`${dnsserver[0]}`]
          }
        }
        if (!form.dnsprimary && form.dnssecondary) {
          dnsserver.push("")
          dnsserver.push(`${form.dnssecondary}`)
          config = {
            "method": "static",
            "address": `${form.address}`,
            "prefix_length": cidr,
            "gateway": `${form.gateway}`,
            "name_servers": [`${dnsserver[0]}`, `${dnsserver[1]}`]
          }
        }
        if (form.dnsprimary && form.dnssecondary) {
          dnsserver.push(`${form.dnsprimary}`)
          dnsserver.push(`${form.dnssecondary}`)
          config = {
            "method": "static",
            "address": `${form.address}`,
            "prefix_length": cidr,
            "gateway": `${form.gateway}`,
            "name_servers": [`${dnsserver[0]}`, `${dnsserver[1]}`]
          }
        }
        console.log(JSON.stringify(config))
        let result = Validation.validateNetConfig(config)
        if (result.count > 0) {
          setResponseString(Object.values(result.errors)[0])
          setIsError(true)
          setTimeout(() => {
            setIsError(false)
          }, 3000);
        }
        else {
          api.setNetworkConfigStatic(result.input, function (res) {
            if (res.result === "ok") {
              setResponseString(`Set Static Config Succes`)
              setIsValid(true)
              setTimeout(() => {
                setIsValid(false)
              }, 3000);
            }
            else {
              setResponseString(`Set Static Config Error`)
              setIsError(true)
              setTimeout(() => {
                setIsError(false)
              }, 3000);
            }
          });
        }
      }
    }
    else {
      console.log(radioSelected)
      const config = {
        "method": "dhcp"
      }
      let result = Validation.validateNetConfig(config)
      if (result.count > 0) {
        setResponseString(`Error in config`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
      else {
        api.setNetworkConfigDhcp(result.input, function (res) {
          console.log(res)
          if (res.result === "ok") {
            setResponseString(`Set Static Config Succes`)
            setIsValid(true)
            setTimeout(() => {
              setIsValid(false)
            }, 3000);
          }
          else {
            setResponseString(`Set Static Config Error`)
            setIsError(true)
            setTimeout(() => {
              setIsError(false)
            }, 3000);
          }
        });
      }
    }
  }

  const findFormErrors = () => {
    const { address, gateway, netmask, dnsprimary, dnssecondary } = form
    const newErrors = {}
    // name errors
    if (!address || !validateIPaddress(address)) newErrors.address = 'IP has invalid format'
    if (address === '') newErrors.address = 'This field is required'
    if (!gateway || gateway === '' || !validateIPaddress(gateway)) newErrors.gateway = 'IP has invalid format'
    if (!netmask || netmask === '' || !validateIPaddress(netmask)) newErrors.netmask = 'IP has invalid format'
    if (dnsprimary) {
      if (!dnsprimary || !validateIPaddress(dnsprimary)) newErrors.dnsprimary = 'IP has invalid format'
    }
    if (dnssecondary) {
      if (!dnssecondary || !validateIPaddress(dnssecondary)) newErrors.dnssecondary = 'IP has invalid format'
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
            onChange={ButtonSelectRadio_Click}
            checked={stateRadioDhcp}
          />
          <Form.Check
            type="radio"
            label="Use the following IP address:"
            id="radiostatic"
            onChange={ButtonSelectRadio_Click}
            checked={stateRadioStatic}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2">
        <Form.Label align="right" column sm={2}>
          IP Address
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            placeholder="IP Address"
            onChange={e => setField('address', e.target.value)}
            isInvalid={!!errors.address}
            disabled={ipAddressDisabled}
            value={form.address}
          />
          <Form.Control.Feedback type='invalid'>{errors.address}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label align="right" column sm={2}>
          Select Netmask
        </Form.Label>
        <Col xs={2} align="left">
          <Form.Control
            className="form-control-custom" //makes gray the control
            as="select"
            bsPrefix={"form-select"} //shows the control like a combobox
            onChange={e => setField('netmask', e.target.value)}
            isInvalid={!!errors.netmask}
            disabled={netmaskDisabled}
            value={form.netmask}
          >
            <option value="255.255.255.0">255.255.255.0</option>
            <option value="255.255.0.0">255.255.0.0</option>
            <option value="255.0.0.0">255.0.0.0</option>
          </Form.Control>
          <Form.Control.Feedback type='invalid'>{errors.netmask}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label align="right" column sm={2}>
          Default Gateway
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            placeholder="Gateway"
            onChange={e => setField('gateway', e.target.value)}
            isInvalid={!!errors.gateway}
            disabled={gatewayDisabled}
            value={form.gateway}
          />
          <Form.Control.Feedback type='invalid'>{errors.gateway}</Form.Control.Feedback>
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
            onChange={e => setField('dnsprimary', e.target.value)}
            isInvalid={!!errors.dnsprimary}
            disabled={dnsPrimaryDisabled}
            value={form.dnsprimary}
          />
          <Form.Control.Feedback type='invalid'>{errors.dnsprimary}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label align="right" column sm={2}>
          Secondary
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            placeholder="Secondary DNS"
            onChange={e => setField('dnssecondary', e.target.value)}
            isInvalid={!!errors.dnssecondary}
            disabled={dnsSecondaryDisabled}
            value={form.dnssecondary}
          />
          <Form.Control.Feedback type='invalid'>{errors.dnssecondary}</Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group>
        <Col sm={{ span: 10, offset: 2 }}>
          <Stack direction="horizontal" gap={3}>
            <Button onClick={ButtonSetNetworkConfig_Click}>Set Config</Button>
            <Button onClick={ButtonGetNetworkConfig_Click}>Get Config</Button>
            <Button onClick={ButtonPing_Click}>Ping</Button>
          </Stack>
        </Col>
      </Form.Group>
    </Form>
  )
}

export default Network;