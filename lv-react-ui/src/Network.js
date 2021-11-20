import './App.css';
import api from "./api"
import React from "react";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button';

function clickHandler(){
  console.log("clicked in Ping");
  api.getPing(function(res){
    console.log(res)
  })
}

function Network() {
  return (
    <Form>
        <fieldset>
            <Form.Group as={Row} className="mb-3">
            <Form.Label as="legend" column sm={1}>
                
            </Form.Label>
            <Col sm={2}>
                <Form.Check
                type="radio"
                label="Obtain an IP address automatically"
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
                />
                <Form.Check
                type="radio"
                label="Use the following IP address:"
                name="formHorizontalRadios"
                id="formHorizontalRadios2"
                />
            </Col>
            </Form.Group>
        </fieldset>
        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
            <Form.Label column sm={1}>
            Ip address:
            </Form.Label>
            <Col sm={10}>
            <Form.Control type="ipaddress" placeholder="IP address" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Subnet mask
            </Form.Label>
            <Col sm={10}>
            <Form.Control type="subnetmask" placeholder="Subnet mask" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Default Gateway
            </Form.Label>
            <Col sm={10}>
            <Form.Control type="gateway" placeholder="Gateway" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Preferred DNS server
            </Form.Label>
            <Col sm={10}>
            <Form.Control type="preferreddns" placeholder="DNS Primary" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={1}>
            Alternate DNS
            </Form.Label>
            <Col sm={10}>
            <Form.Control type="alternatedns" placeholder="DNS Secondary" />
            </Col>
        </Form.Group>

        <Form.Group>
        <Col sm={{ span: 10, offset: 1 }}>
          <Stack direction="horizontal" gap={3}>
            <Button>Set Config</Button>
            <Button onClick={clickHandler}>Ping</Button>
          </Stack>
          </Col>
        </Form.Group>
        </Form>
  );
}

export default Network;