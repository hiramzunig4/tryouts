import React, { useState, useRef } from 'react'

import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

function Database(props) {

  function UploadFile(filename) {
    console.log(filename[0].name)
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
              <FormControl type="file" onChange={(e) => UploadFile(e.target.files)} />
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