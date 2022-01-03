import React, { useState } from 'react'

import api from "./api"

import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import FormControl from 'react-bootstrap/FormControl'

function Database(props) {

  //Response from yeico appliance
  const [responseString, setResponseString] = React.useState("")

  //Alerts
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);

  function uploadFile(filename) {
    console.log("Apoco si la envio asi na mas el nombre se envia?")
    console.log(filename[0])
    api.stopApp(function (res) {
      console.log(res)
    }, props.device, "nerves", props.pass)
    api.uploadFile(function (res) {
      console.log(res)
      if (res.result === "ok") {
        setResponseString(`File Uploaded`)
        setIsValid(true)
        setTimeout(() => {
          setIsValid(false)
        }, 3000);
      }
      else {
        setResponseString(`File Upload Fail`)
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 3000);
      }
    }, props.device, "nerves", props.pass, filename[0])
    api.startApp(function (res) {
      console.log(res)
    }, props.device, "nerves", props.pass)
  }

  function downloadFile() {
    api.stopApp(function (res) {
      console.log(res)
    }, props.device, "nerves", props.pass)
    api.downloadFile(props.device, "nerves", props.pass, props.mac)
    api.startApp(function (res) {
      console.log(res)
    }, props.device, "nerves", props.pass)
  }

  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
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
          Database
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Navbar >
          <Navbar.Collapse as={Col} className="justify-content-center">
            <Form>
              <Alert show={isValid} variant="success">
                {responseString}
              </Alert>
              <Alert show={isError} variant="danger">
                {responseString}
              </Alert>
              <Button onClick={handleClick}>
                Upload a file
              </Button>
              <FormControl type="file" style={{ display: 'none' }} ref={hiddenFileInput} onChange={(e) => uploadFile(e.target.files)} />
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={downloadFile}>Backup</Button>
        <Button variant="dark" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal >
  );
}

export default Database;