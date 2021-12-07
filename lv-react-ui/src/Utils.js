import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import './App.css';
import api from "./api"

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

function Utils() {

  const [devices, setDevices] = useState([])
  const [modalShow, setModalShow] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState("visually-hidden")

  const [show, setShow] = useState(false);

  function buttonDiscoveryClick() {
    setShowSpinner("")
    api.getNetworkDiscover(function (res) {
      console.log(JSON.stringify(res))
      setShowSpinner("visually-hidden")
      setDevices(res)
    })
  }

  function buttonBlinkClick(device) {
    api.blinkNetworkDevice(function (res) {
      console.log(JSON.stringify(res))
    }, device.data.ipaddr)
  }


  function buttonPingFromDiscover(device) {
    setShow(true)
    console.log(`Ping to device ip ${device.data.ipaddr}`)
    api.getNetworkPing(function (res) {
      console.log(JSON.stringify(res))
    }, device.data.ipaddr)
  }

  const rows = devices.map(drevice => <tr key="{device.data.macaddr}">
    <td>{drevice.data.hostname}</td>
    <td>{drevice.data.macaddr}</td>
    <td>{drevice.data.version}</td>
    <td>{drevice.data.ipaddr}</td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLaptopCode} /></Button></td>
    <td> <Button onClick={() => buttonBlinkClick(drevice)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLightbulb} /></Button></td>
    <td> <Button onClick={() => setModalShow(true)} variant="dark" size="sm"> <FontAwesomeIcon icon={faCog} /></Button></td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)} variant="dark" size="sm"> <FontAwesomeIcon icon={faDatabase} /></Button></td>
  </tr>)

  const toastPing = () => {
    return (
      <>
        <ToastContainer position='bottom-start' className="p-3">
          <Toast animation={true} bg={'dark'} onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Ping</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className='text-white'>Sale cuando clickeo en Ping</Toast.Body>
          </Toast>
        </ToastContainer>
      </>
    )
  }

  function MyVerticallyCenteredModal(props) {
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

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container>
      {toastPing()}
      <Navbar >
        <Navbar.Brand>Laurel View Configuration</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button onClick={buttonDiscoveryClick} variant="dark" title="Discover Devices">Discovery</Button>
        </Navbar.Collapse>
      </Navbar>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Hostname</th>
            <th>MAC Address</th>
            <th>Version</th>
            <th>IP Address</th>
            <th>Ping</th>
            <th>Blink</th>
            <th>Network Config</th>
            <th>Database</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
      <Spinner className={showSpinner} animation="border" role="status" variant="dark" > </Spinner>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
  )
}

export default Utils;