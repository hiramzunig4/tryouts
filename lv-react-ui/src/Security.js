import React, { useState } from 'react'

import api from "./api"

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'

function Security(props) {

    const [newPass, setNewPass] = React.useState("")

    //Response from yeico appliance
    const [responseString, setResponseString] = React.useState("")

    //Alerts
    const [isValid, setIsValid] = useState(false);
    const [isError, setIsError] = useState(false);

    function buttonSetNewPassClick() {
        api.setNewPass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                setResponseString(`Set New Password Success`)
                setIsValid(true)
                setTimeout(() => {
                    setIsValid(false)
                    setNewPass("")
                }, 3000);
            }
            else {
                setResponseString(`Set New Password Fail`)
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                    setNewPass("")
                }, 3000);
            }
        }, props.device, "nerves", props.pass, Buffer.from(`${newPass}`).toString('base64'))
    }

    function buttonResetPassClick() {
        api.setDisablePass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                setResponseString(`Reset Password Success`)
                setIsValid(true)
                setTimeout(() => {
                    setIsValid(false)
                }, 3000);
            }
            else {
                setResponseString(`Reset Password Fail`)
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                }, 3000);
            }
        }, props.device, "nerves", props.pass)
    }

    function buttonDisablePassClick() {
        api.setResetPass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                setResponseString(`Disable Password Success`)
                setIsValid(true)
                setTimeout(() => {
                    setIsValid(false)
                }, 3000);
            }
            else {
                setResponseString(`Disable Password Fail`)
                setIsError(true)
                setTimeout(() => {
                    setIsError(false)
                }, 3000);
            }
        }, props.device, "nerves", props.pass)
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
                    Password Manager
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
                            New Pass
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                placeholder="Enter New Pass"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={buttonSetNewPassClick} variant='dark'>Set New</Button>
                <Button onClick={buttonResetPassClick} variant='dark'>Reset</Button>
                <Button onClick={buttonDisablePassClick} variant='dark'>Disable</Button>
                <Button variant='dark' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default Security;