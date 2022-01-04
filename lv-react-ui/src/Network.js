import React, { useState } from 'react'

import api from './api'
import Validation from './Validation'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

function Network(props) {
    //radio selector
    const [radioSelected, setRadioSelected] = React.useState("radiodhcp")
    const [stateRadioDhcp, setStateRadioDhcp] = React.useState(true)
    const [stateRadioStatic, setStateRadioStatic] = React.useState(false)

    //disable componets
    const [ipAddressDisabled, setIpAddressdDisabled] = React.useState(true);
    const [gatewayDisabled, setGatewayDisabled] = React.useState(true);
    const [netmaskDisabled, setNetmaskDisabled] = React.useState(true);
    const [dnsPrimaryDisabled, setDnsPrimaryDisabled] = React.useState(true);
    const [dnsSecondaryDisabled, setDnsSecondaryDisabled] = React.useState(true);

    //Errors
    const [form, setForm] = useState({ address: "", gateway: "", netmask: "255.255.255.0", dnsprimary: "", dnssecondary: "" })
    const [errors, setErrors] = useState({ address: "", gateway: "", netmask: "", dnsprimary: "", dnssecondary: "" })

    //Response from yeico appliance
    const [responseString, setResponseString] = React.useState("")

    //Alerts
    const [isValid, setIsValid] = useState(false);
    const [isError, setIsError] = useState(false);

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
        setRadioSelected(`${event.target.id}`)
        console.log(radioSelected)
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

    function validateIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
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

    function ButtonGetNetworkConfig_Click() {
        console.log("clicked in get config");
        api.getNetworkConfig(function (res) {
            console.log(res)
            if (res.result === "ok") {
                if (res.message.config.ipv4.method === "dhcp") {
                    setRadioSelected("radiodhcp");
                    form.address = ""
                    form.gateway = ""
                    form.dnsprimary = ""
                    form.dnssecondary = ""
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
        }, props.device, "nerves", props.pass)
    }

    //SetConfig
    const ButtonSetNetworkConfig_Click = (event) => {
        event.preventDefault()
        //the config is static
        console.log(`Esto es lo realmente seleccionado esta bieb? ${radioSelected}`)
        if (radioSelected === "radiostatic") {
            // get our new errors
            const newErrors = findFormErrors()
            // Conditional logic:
            if (Object.keys(newErrors).length > 0) {
                // We got errors!
                setErrors(newErrors)
            }
            else {

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
                console.log(`Se imprime el result de la validacion que trae? ${JSON.stringify(result)}`)
                if (result.count > 0) {
                    let error = `${Object.keys(result.errors)[0]}`
                    console.log(`Esto contiene error ${error}`)
                    switch (error) {
                        case "adddress":
                            setErrors({ address: Object.values(result.errors)[0] })
                            break
                        case "gateway":
                            setErrors({ gateway: Object.values(result.errors)[0] })
                            break
                        case "netmask":
                            setErrors({ netmask: Object.values(result.errors)[0] })
                            break
                        case "dnsprimary":
                            setErrors({ dnsprimary: Object.values(result.errors)[0] })
                            break
                        case "dnssecondary":
                            setErrors({ dnssecondary: Object.values(result.errors)[0] })
                            break
                        default:
                            break
                    }
                }
                else {
                    api.setNetworkConfigStatic(result.input, function (res) {
                        console.log(`Esta es la respuesta del set static ${JSON.stringify(res)}`)
                        if (res.result === "ok") {
                            setResponseString(`Set Static Config Succes`)
                            setIsValid(true)
                            setTimeout(() => {
                                setIsValid(false)
                                form.address = ""
                                form.gateway = ""
                                form.dnsprimary = ""
                                form.dnssecondary = ""
                                props.onHide()
                            }, 3000);

                        }
                        else {
                            setResponseString(`Set Static Config Error`)
                            setIsError(true)
                            setTimeout(() => {
                                setIsError(false)
                            }, 3000);
                        }
                    }, props.device, "nerves", props.pass);
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
                //FIXME when i send valid config the nervesbackdoor doesent response ok?, i think the response is in the new ip previously config
                //i dont need to cath the response?
                api.setNetworkConfigDhcp(result.input, function (res) {
                    console.log(res)
                    if (res.result === "ok") {
                        setResponseString(`Set DHCP Config Succes`)
                        setIsValid(true)
                        setTimeout(() => {
                            setIsValid(false)
                            form.address = ""
                            form.gateway = ""
                            form.dnsprimary = ""
                            form.dnssecondary = ""
                            props.onHide()
                        }, 3000);
                    }
                    else {
                        setResponseString(`Set DHCP Config Error`)
                        setIsError(true)
                        setTimeout(() => {
                            setIsError(false)
                        }, 3000);
                    }
                }, props.device, "nerves", props.pass);
            }
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={ButtonGetNetworkConfig_Click}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Network Config
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Alert show={isValid} variant="success">
                        {responseString}
                    </Alert>
                    <Alert show={isError} variant="danger">
                        {responseString}
                    </Alert>
                    <Form.Group className="mb-1">
                        <Form.Label as="legend">
                        </Form.Label>
                        <Col align="left">
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
                        <Form.Label align="right" column sm={3}>
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
                    <Form.Label as="legend">
                    </Form.Label>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Select Netmask
                        </Form.Label>
                        <Col xs={3} align="left">
                            <Form.Control
                                //</Col>className="form-control-custom" //makes gray the control
                                as="select"
                                bsPrefix={"form-select"}
                                value={form.netmask}
                                disabled={netmaskDisabled}
                                isInvalid={!!errors.netmask}
                                onChange={e => setField('netmask', e.target.value)}
                            >
                                <option value="255.255.255.0">255.255.255.0</option>
                                <option value="255.255.0.0">255.255.0.0</option>
                                <option value="255.0.0.0">255.0.0.0</option>
                            </Form.Control>
                            <Form.Control.Feedback type='invalid'>{errors.netmask}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Default Gateway
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Gateway"
                                value={form.gateway}
                                disabled={gatewayDisabled}
                                isInvalid={!!errors.gateway}
                                onChange={e => setField('gateway', e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.gateway}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Set DNS Servers:
                        </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Primary
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Primary DNS"
                                value={form.dnsprimary}
                                disabled={dnsPrimaryDisabled}
                                isInvalid={!!errors.dnsprimary}
                                onChange={e => setField('dnsprimary', e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.dnsprimary}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Secondary
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Secondary DNS"
                                value={form.dnssecondary}
                                disabled={dnsSecondaryDisabled}
                                isInvalid={!!errors.dnssecondary}
                                onChange={e => setField('dnssecondary', e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.dnssecondary}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Stack direction="horizontal" gap={3}>

                            </Stack>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='dark' onClick={ButtonGetNetworkConfig_Click}>Get Config</Button>
                <Button variant='dark' onClick={ButtonSetNetworkConfig_Click}>Set Config</Button>
                <Button variant='dark' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default Network;