// src/screens/LiveTrackingPage.js
import React, { useState } from 'react';
import {
  Card,
  ProgressBar,
  ListGroup,
  Badge,
  Form,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';

const stepOrder = [
  'Order Placed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const LiveTrackingPage = () => {
  const [customerId, setCustomerId] = useState('');
  const [city, setCity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (customerId) query.append('customerId', customerId);
      if (city) query.append('city', city);
      if (deliveryDate) query.append('deliveryDate', deliveryDate);

      const res = await axios.get(`/api/admin/tracking/search?${query.toString()}`);
      setOrders(res.data);
    } catch (error) {
      alert('❌ Failed to fetch tracking data');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Live Order Tracking</h2>

      <Form className="mb-4">
        <Row className="g-2">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Customer ID (Optional)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="City (Optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </Col>
          <Col md={1}>
            <Button onClick={fetchTrackingData} disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {orders.length === 0 && !loading && (
        <div className="text-center text-muted">No matching orders found</div>
      )}

      {orders.map((order, idx) => {
        const steps = stepOrder.map((label) => ({
          label,
          timestamp: order.timestamps[label.toLowerCase().replace(/\s/g, '')],
          completed: stepOrder.indexOf(label) <= stepOrder.indexOf(order.status)
        }));

        const progress =
          (steps.filter((s) => s.completed).length / steps.length) * 100;

        return (
          <Card key={idx} className="mb-4 p-3 shadow-sm">
            <div className="d-flex justify-content-between">
              <h5>{order.customerId?.name || 'Unknown User'}</h5>
              <small className="text-muted">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </small>
            </div>
            <p className="mb-2">
              <strong>Status:</strong> {order.status}
            </p>
            <ProgressBar
              now={progress}
              label={`${Math.round(progress)}%`}
              className="mb-3"
              animated
            />
            <ListGroup>
              {steps.map((step, i) => (
                <ListGroup.Item
                  key={i}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{step.label}</strong>
                    <br />
                    <small>
                      {step.timestamp
                        ? new Date(step.timestamp).toLocaleString()
                        : 'Pending'}
                    </small>
                  </div>
                  <Badge bg={step.completed ? 'success' : 'secondary'}>
                    {step.completed ? 'Completed' : 'Pending'}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        );
      })}
    </div>
  );
};

export default LiveTrackingPage;
