import React, { useState, useEffect } from 'react'

import './App.css'
import api from "./api"
import Network from './Network'
import Database from './Database'
import Settings from './Settings'
import Login from './Login'

import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Table from 'react-bootstrap/Table'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import ToastContainer from 'react-bootstrap/ToastContainer'

function App() {

  useEffect(() => {
    if (discoverOnload) {
      buttonDiscoveryClick()
    }
  })

  const [devices, setDevices] = useState([])
  const [discoverOnload, setDiscoverOnLoad] = React.useState(true)
  const [showNetworkModal, setShowNetworkModal] = React.useState(false)
  const [showDatabaseModal, setShowDatabaseModal] = React.useState(false)
  const [showSettingsModal, setShowSettingsModal] = React.useState(false)
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showSpinner, setShowSpinner] = React.useState("visually-hidden")

  const [messageToToast, setMessageToToast] = React.useState("")
  const [toastColor, setToastColor] = React.useState("dark")
  const [showToast, setShowToast] = useState(false);

  const [selectIpDevice, setSelectIpDevice] = React.useState("")
  const [selectMacDevice, setSelectMacDevice] = React.useState("")
  const [devicePass, setDevicePass] = React.useState("")

  function saveLocalStorage(res) {
    //save devices with password
    for (let i = 0; i <= res.length - 1; i++) {
      //if device dont exist, save local storage
      if (!(localStorage.getItem(`${res[i].data.macaddr}`))) {
        var passEncode = Buffer.from(`${res[i].data.macaddr}`).toString('base64')
        localStorage.setItem(`${res[i].data.macaddr}`, passEncode)
      }
    }
  }

  function getPassFromLocalStorage(device) {
    return localStorage.getItem(device)
  }

  function buttonDiscoveryClick() {
    //onload
    if (discoverOnload) {
      setDiscoverOnLoad(false)
    }
    setShowSpinner("")
    api.getNetworkDiscover(function (res) {
      console.log(JSON.stringify(res))
      setShowSpinner("visually-hidden")
      saveLocalStorage(res)
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
    var passEncode = getPassFromLocalStorage(device.data.macaddr)
    var deviceLocal = Buffer.from(passEncode, 'base64').toString('ascii')
    api.getNetworkPing(function (res) {
      console.log(res)
      if (res.result === "ok") {
        setTypeOfToast('dark', `Ping to ${device.data.ipaddr} success`)
      }
      else {
        setTypeOfToast('danger', `Ping to ${device.data.ipaddr} failed`)
      }
    }, device.data.ipaddr, "nerves", deviceLocal)
  }

  function buttonNetworkClick(device) {
    setSelectIpDevice(device.data.ipaddr)
    var passEncode = getPassFromLocalStorage(device.data.macaddr)
    var deviceLocal = Buffer.from(passEncode, 'base64').toString('ascii')
    setDevicePass(deviceLocal)
    setSelectMacDevice(device.data.macaddr)
    setShowNetworkModal(true)
  }

  function buttonDatabaseClick(device) {
    setSelectIpDevice(device.data.ipaddr)
    var passEncode = getPassFromLocalStorage(device.data.macaddr)
    var deviceLocal = Buffer.from(passEncode, 'base64').toString('ascii')
    setSelectMacDevice(device.data.macaddr)
    setDevicePass(deviceLocal)
    setShowDatabaseModal(true)
  }

  function buttonSettingsClick(device) {
    setSelectIpDevice(device.data.ipaddr)
    var passEncode = getPassFromLocalStorage(device.data.macaddr)
    var deviceLocal = Buffer.from(passEncode, 'base64').toString('ascii')
    setDevicePass(deviceLocal)
    setSelectMacDevice(device.data.macaddr)
    setShowSettingsModal(true)
  }

  function buttonLoginClick(device) {
    setSelectIpDevice(device.data.ipaddr)
    var passEncode = getPassFromLocalStorage(device.data.macaddr)
    var deviceLocal = Buffer.from(passEncode, 'base64').toString('ascii')
    setDevicePass(deviceLocal)
    setSelectMacDevice(device.data.macaddr)
    setShowLoginModal(true)
  }

  const rows = devices.map(device =>
    <tr key={device.data.macaddr}>
      <td>{device.data.hostname}</td>
      <td>{device.data.macaddr}</td>
      <td>{device.data.version}</td>
      <td>{device.data.ipaddr}</td>
      <td> <Button onClick={() => buttonLoginClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faSignInAlt} /></Button></td>
      <td> <Button onClick={() => buttonPingFromDiscover(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLaptopCode} /></Button></td>
      <td> <Button onClick={() => buttonBlinkClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faLightbulb} /></Button></td>
      <td> <Button onClick={() => buttonSettingsClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faUserCog} /></Button></td>
      <td> <Button onClick={() => buttonNetworkClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faCog} /></Button></td>
      <td> <Button onClick={() => buttonDatabaseClick(device)} variant="dark" size="sm"> <FontAwesomeIcon icon={faDatabase} /></Button></td>
    </tr>
  )

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
            <th>Login</th>
            <th>Ping</th>
            <th>Blink</th>
            <th>Settings</th>
            <th>Network</th>
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
        device={selectIpDevice}
        pass={devicePass}
        mac={selectMacDevice}
      />
      <Database
        show={showDatabaseModal}
        onHide={() => {
          setShowDatabaseModal(false)
        }}
        device={selectIpDevice}
        pass={devicePass}
        mac={selectMacDevice}
      />
      <Settings
        show={showSettingsModal}
        onHide={() => {
          setShowSettingsModal(false)
        }}
        device={selectIpDevice}
        pass={devicePass}
        mac={selectMacDevice}
      />
      <Login
        show={showLoginModal}
        onHide={() => {
          setShowLoginModal(false)
        }}
        device={selectIpDevice}
        pass={devicePass}
        mac={selectMacDevice}
      />
    </Container>
  )
}
export default App;