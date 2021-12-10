import React from 'react'

import api from "./api"

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Security(props) {

    const [newPass, setNewPass] = React.useState("")

    function ButtonSetNewPassClick() {
        api.setNewPass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                console.log("Password Changed")
            }
            else {
                console.log("Error en set password")
            }
        }, props.device, "nerves", props.pass, Buffer.from(`${newPass}`).toString('base64'))
    }

    function ButtonResetPassClick() {
        api.setDisablePass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                console.log("Reset password ok")
            }
            else {
                console.log("Error reset password")
            }
        }, props.device, "nerves", props.pass)
    }

    function ButtonDisablePassClick() {
        api.setResetPass(function (res) {
            console.log(res)
            if (res.result === "ok") {
                console.log("Disable Password ok")
            }
            else {
                console.log("Error disable pass")
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
                <Form>

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
                <Button onClick={ButtonSetNewPassClick} variant='dark'>Set New</Button>
                <Button onClick={ButtonResetPassClick} variant='dark'>Reset</Button>
                <Button onClick={ButtonDisablePassClick} variant='dark'>Disable</Button>
                <Button variant='dark' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default Security;