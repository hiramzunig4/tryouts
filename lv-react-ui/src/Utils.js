import { useState } from 'react'

import './App.css';
import api from "./api"
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import React from "react"

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
    <td>{drevice.data.ifname}</td>
    <td>{drevice.data.macaddr}</td>
    <td>{drevice.data.name}</td>
    <td>{drevice.data.version}</td>
    <td>{drevice.data.ipaddr}</td>
    <td> <Button onClick={() => buttonPingFromDiscover(drevice)}
      variant="info" size="sm">Ping</Button></td>
  </tr>)

  return (
    <>
      <Button variant="primary" onClick={buttonDiscoveryClick}>
        Discovery
      </Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Hostname</th>
            <th>Ifname</th>
            <th>MAC Address</th>
            <th>Name</th>
            <th>Version</th>
            <th>IP Address</th>
            <th>Ping</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </>
  )
}

export default Utils;