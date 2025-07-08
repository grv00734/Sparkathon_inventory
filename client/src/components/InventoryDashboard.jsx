import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('/api/inventory')
      .then((res) => setInventory(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Inventory Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Warehouse</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>{item.warehouseName}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryDashboard;
