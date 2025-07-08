import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  return (
    <div>
      <h1>Smart Delivery Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>Live Tracking</Card.Title>
              <LinkContainer to="/live-tracking">
                <Button variant="primary">View</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>Demand Forecast</Card.Title>
              <LinkContainer to="/forecast">
                <Button variant="success">Forecast</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>Inventory</Card.Title>
              <LinkContainer to="/inventory">
                <Button variant="warning">Dashboard</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomeScreen;