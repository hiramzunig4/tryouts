import React, { useState } from 'react'

import api from "./api"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

function Settings(props) {

    const [currentPass, setCurrentPass] = React.useState("")

    //Response from yeico appliance
    const [responseString, setResponseString] = React.useState("")

    //Alerts
    const [isValid, setIsValid] = useState(false);
    const [isError, setIsError] = useState(false);

    function buttonLoginClick() {
        api.getNetworkPing(function (res) {
            console.log(res)
            if (res.result === "ok") {
                setResponseString(`Login Success`)
                setIsValid(true)
                localStorage.setItem(props.mac, currentPass)
                setTimeout(() => {
                    setIsValid(false)
                    setCurrentPass("")
                }, 3000);
            }
            else {
                setResponseString(`Login Fail Chek Password`)
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                    setCurrentPass("")
                }, 3000);
            }
        }, props.device, "nerves", currentPass)
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
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => { e.preventDefault(); }}>
                    <Alert show={isValid} variant="success">
                        {responseString}
                    </Alert>
                    <Alert show={isError} variant="danger">
                        {responseString}
                    </Alert>

                    <Form.Group as={Row} className="mb-2">
                        <Form.Label align="right" column sm={3}>
                            Password
                        </Form.Label>
                        <Col sm={4}>
                            <Form.Control
                                type="password"
                                placeholder="Enter Current Pass"
                                value={currentPass}
                                onChange={e => setCurrentPass(e.target.value)}
                            /></Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={buttonLoginClick} variant='dark'>Set Current Pass</Button>
                <Button variant='dark' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default Settings;