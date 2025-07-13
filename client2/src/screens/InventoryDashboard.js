// client/src/screens/InventoryDashboard.js
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);


  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await axios.get('/api/inventory');
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <h2>Inventory Dashboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Product Image</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.SKU}</td>
              <td>{item.Warehouse}</td>
              <td>{item.Quantity}</td>
              <td>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.SKU}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InventoryDashboard;
