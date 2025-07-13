import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => (
  <Spinner animation="border" role="status" style={{ margin: 'auto', display: 'block' }}>
    <span className="visually-hidden">Loading...</span>
  </Spinner>
);

export default Loader;
