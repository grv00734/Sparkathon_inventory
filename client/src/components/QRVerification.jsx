import React from 'react';
import QRCode from 'qrcode.react';

const QRVerification = ({ orderId }) => {
  const baseUrl = process.env.REACT_APP_VERIFY_BASE || 'http://localhost:3000/verify';
  return (
    <div>
      <h2>Scan this QR at Delivery</h2>
      <QRCode value={`${baseUrl}/${orderId}`} size={256} />
    </div>
  );
};

export default QRVerification;
