import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'


import './App.css';
import api from "./api"

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';

function Utils() {

  const [devices, setDevices] = useState([])

  function buttonDiscoveryClick() {
    api.getNetworkDiscover(function (res) {
      console.log(JSON.stringify(res))
      setDevices(res)
    })
  }

  function buttonPingFromDiscover(device) {
    console.log(`Ping to device ip ${device.data.ipaddr}`)
    api.getNetworkPing(function (res) {
      console.log(JSON.stringify(res))
    }, device.data.ipaddr)
  }

  const rows = devices.map(drevice => <tr key="d.data.macaddr">
    <td>{drevice.data.hostname}</td>
    <td>{drevice.data.macaddr}</td>
    <td>{drevice.data.version}</td>
    <td>{drevice.data.ipaddr}</td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)}
      variant="dark" size="sm"> <FontAwesomeIcon icon={faLaptopCode} /></Button></td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)}
      variant="dark" size="sm"> <FontAwesomeIcon icon={faLightbulb} /></Button></td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)}
      variant="dark" size="sm"> <FontAwesomeIcon icon={faCog} /></Button></td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)}
      variant="dark" size="sm"> <FontAwesomeIcon icon={faDatabase} /></Button></td>
  </tr>)

  return (
    <Container>

      <Navbar >
        <Navbar.Brand>Laurel View Configuration</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button onClick={buttonDiscoveryClick} variant="success" title="Create New">Discovery</Button>
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
    </Container>
  )
}

export default Utils;