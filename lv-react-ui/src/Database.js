import React, { useState } from 'react'

import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'

function Database(props) {

  function handleFileSelected() { }

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
            <input onChange={handleFileSelected} type="file" />
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