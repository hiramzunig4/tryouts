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

function clickHandlerEth0(){
  console.log("clicked in get config");
  api.getConfig(function(res){
    console.log(res)
  })
}

function Network(){

  const [fieldDisabled, setFieldDisabled] = React.useState(false);

  function handleChange(event){
    console.log(event.target.id)
    if(event.target.id === "radiodhcp"){
      setFieldDisabled(true)
    }
    else{
      setFieldDisabled(false)
    }
  }

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
                  id="radiodhcp"
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  label="Use the following IP address:"
                  name="formHorizontalRadios"
                  id="radiostatic"
                  onChange={handleChange}
                />
            </Col>
            </Form.Group>
        </fieldset>
        <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={1}>
            Ip address:
            </Form.Label>
            <Col sm={10}>
            <Form.Control 
              type="ipaddress" 
              id="IpAddress"
              disabled={fieldDisabled} 
              placeholder="IP address" />
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
            <Button onClick={clickHandlerEth0}> Get Config </Button>
          </Stack>
          </Col>
        </Form.Group>
        </Form>
  );
}

export default Network;