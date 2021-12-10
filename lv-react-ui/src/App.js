import React, { useState } from 'react'

import './App.css';
import api from "./api"
import Network from './Network'
import Security from './Security';
import Database from './Database'

import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Table from 'react-bootstrap/Table'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import ToastContainer from 'react-bootstrap/ToastContainer'

function App() {

  const [devices, setDevices] = useState([])
  const [showNetworkModal, setShowNetworkModal] = React.useState(false)
  const [showDatabaseModal, setShowDatabaseModal] = React.useState(false)
  const [showSecurityModal, setShowSecurityModal] = React.useState(false)
  const [showSpinner, setShowSpinner] = React.useState("visually-hidden")

  const [messageToToast, setMessageToToast] = React.useState("")
  const [toastColor, setToastColor] = React.useState("dark")
  const [showToast, setShowToast] = useState(false);

  const [selectDevice, setSelectDevice] = React.useState("")
  const [devicePass, setDevicePass] = React.useState("")

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
      setTypeOfToast('dark', `Blink action sent to ${device.data.ipaddr}`)
    }, device.data.ipaddr)
  }


  function buttonPingFromDiscover(device) {
    api.getNetworkPing(function (res) {
      console.log(res)
      if (res.result === "ok") {
        setTypeOfToast('dark', `Ping to ${device.data.ipaddr} success`)
      }
      else {
        setTypeOfToast('danger', `Ping to ${device.data.ipaddr} failed`)
      }
    }, device.data.ipaddr, "nerves", device.data.macaddr)
  }

  function buttonNetworkClick(device) {
    setSelectDevice(device.data.ipaddr)
    setDevicePass(device.data.macaddr)
    setShowNetworkModal(true)
  }

  function buttonDatabaseClick(device) {
    setShowDatabaseModal(true)
  }

  function buttonSecurityClick(device) {
    setSelectDevice(device.data.ipaddr)
    setDevicePass(device.data.macaddr)
    setShowSecurityModal(true)
  }

  const rows = devices.map(device => <tr key="{device.data.macaddr}">
    <td>{device.data.hostname}</td>
    <td>{device.data.macaddr}</td>
    <td>{device.data.version}</td>
    <td>{device.data.ipaddr}</td>
    <td> <Button onClick={() => buttonPingFromDiscover(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLaptopCode} /></Button></td>
    <td> <Button onClick={() => buttonBlinkClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLightbulb} /></Button></td>
    <td> <Button onClick={() => buttonSecurityClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faUserCog} /></Button></td>
    <td> <Button onClick={() => buttonNetworkClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faCog} /></Button></td>
    <td> <Button onClick={() => buttonDatabaseClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faDatabase} /></Button></td>
  </tr>)

  function setTypeOfToast(color, message) {
    setToastColor(color)
    setMessageToToast(message)
    setShowToast(true)
  }

  const toastMessages = (message, color) => {
    return (
      <>
        <ToastContainer position='bottom-start' className="p-3">
          <Toast animation={true} bg={color} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Message</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className='text-white'>{message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </>
    )
  }

  return (
    <Container>
      {toastMessages(messageToToast, toastColor)}
      <Navbar >
        <Navbar.Brand>Laurel View Setup</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button onClick={buttonDiscoveryClick} variant="dark" title="Discover Devices">Discovery</Button>
        </Navbar.Collapse>
      </Navbar>
      <Table style={{ textAlign: "center" }} striped bordered hover>
        <thead>
          <tr>
            <th>Hostname</th>
            <th>MAC Address</th>
            <th>Version</th>
            <th>IP Address</th>
            <th>Ping</th>
            <th>Blink</th>
            <th>Security</th>
            <th>Network Config</th>
            <th>Database</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
      <Navbar >
        <Navbar.Collapse className="justify-content-center">
          <Spinner className={showSpinner} animation="border" role="status" variant="dark"> </Spinner>
        </Navbar.Collapse>
      </Navbar>
      <Network
        show={showNetworkModal}
        onHide={() => {
          setShowNetworkModal(false)
          buttonDiscoveryClick()
        }}
        device={selectDevice}
        pass={devicePass}
      />
      <Database
        show={showDatabaseModal}
        onHide={() => {
          setShowDatabaseModal(false)
        }}
      />
      <Security
        show={showSecurityModal}
        onHide={() => {
          setShowSecurityModal(false)
        }}
        device={selectDevice}
        pass={devicePass}
      />
    </Container>
  )
}
export default App;