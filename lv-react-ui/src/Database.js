import React from 'react'

import api from "./api"

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

function Database(props) {

  function uploadFile(filename) {
    console.log("Apoco si la envio asi na mas el nombre se envia?")
    console.log(filename[0])
    api.uploadFile(function (res) {
      console.log(res)
      if (res.result === "ok") {
        console.log("Archivo subido con exito")
      }
      else {
        console.log("Fallo subida de archivo")
      }
    }, props.device, "nerves", props.pass, filename[0])
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
          Backup and Restore Database
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Navbar >
          <Navbar.Collapse as={Col} className="justify-content-center">
            <Form>
              <FormControl type="file" onChange={(e) => uploadFile(e.target.files)} />
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal >
  );
}

export default Database;