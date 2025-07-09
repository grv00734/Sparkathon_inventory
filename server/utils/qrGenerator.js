const QRCode = require('qrcode');

exports.generateDeliveryQR = async (orderId) => {
  const url = `${process.env.QR_BASE_URL}/${orderId}`;
  return await QRCode.toDataURL(url);
};
