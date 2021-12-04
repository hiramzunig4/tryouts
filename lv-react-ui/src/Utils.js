import { useState } from 'react'

import './App.css';
import api from "./api"
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import React from "react"

function Utils() {

  const [devices, setDevices] = useState([])
  const [isDataDevice, setIsDataDevice] = React.useState(false)

  function buttonDiscoveryClick() {
    api.getNetworkDiscover(function (res) {
      console.log(JSON.stringify(res))
      setDevices(res)
    })
  }

  function rows() {
    console.log(devices)
    return devices.map(d => <tr key="d.data.macaddr">
      <td>{d.data.macaddr}</td>
    </tr>)
  }

  return (
    <>
      <Button variant="primary" onClick={buttonDiscoveryClick}>
        Discovery
      </Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {rows()}
        </tbody>
      </Table>

    </>
  )

}

export default Utils;