import React, { useState } from 'react'

import api from './api'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

function ModalNetwork(props) {

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
        setRadioSelected(event.target.id)
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

    function ButtonGetNetworkConfig_Click() {
        console.log("clicked in get config");
        console.log(`Ping to ${props.device}`)
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
        }, props.device)
    }

    return (
        <Modal
            {...props}
            size="lg"
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                                disabled={ipAddressDisabled}
                            /> </Col>
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
                                disabled={netmaskDisabled}
                            >
                                <option value="255.255.255.0">255.255.255.0</option>
                                <option value="255.255.0.0">255.255.0.0</option>
                                <option value="255.0.0.0">255.0.0.0</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Default Gateway
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Gateway"
                                disabled={gatewayDisabled}
                            />
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
                                disabled={dnsPrimaryDisabled}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label align="right" column sm={3}>
                            Secondary
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Secondary DNS"
                                disabled={dnsSecondaryDisabled}
                            />
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
                <Button onClick={ButtonGetNetworkConfig_Click}>Get Config</Button>
                <Button>Set Config</Button>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ModalNetwork;