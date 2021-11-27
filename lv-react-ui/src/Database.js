import './App.css';
import React from "react";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Database()
{ 
  return (
    <Form>
      <h1>DATABASE</h1>
      <Row>
        <Col xs={6} md={8}>
          <Form.Label align="left">Select folder to backup</Form.Label>
        </Col>
        <Col xs={12} md={8}>
        <Form.Control type="file" onChange={(e) => console.log(e.target.files)} />
        </Col>
        <Col xs={12} md={8}>
        <Col><Button>Backup</Button></Col>
        </Col>
      </Row>
    </Form>
  );
}

export default Database;