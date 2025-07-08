import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Smart Delivery</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ml-auto">
              <LinkContainer to="/live-tracking">
                <Nav.Link>Live Tracking</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/forecast">
                <Nav.Link>Forecast</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/inventory">
                <Nav.Link>Inventory</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/route-optimizer">
                <Nav.Link>Route Optimizer</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;