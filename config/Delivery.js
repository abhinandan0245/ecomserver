// config/delivery.js
const deliveryConfig = {
  delhivery: {
    baseUrl: 'https://track.delhivery.com',
    apiKey: process.env.DELHIVERY_API_KEY,
    clientName: process.env.DELHIVERY_CLIENT_NAME,
    sandbox: process.env.NODE_ENV !== 'production'
  }
};

module.exports = deliveryConfig;
