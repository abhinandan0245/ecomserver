// const axios = require('axios');

// const env = process.env.DELHIVERY_ENV || (process.env.NODE_ENV === 'production' ? 'prod' : 'staging');
// const baseURL = env === 'prod' ? process.env.DELHIVERY_BASE_URL : process.env.DELHIVERY_TEST_URL;

// const delhivery = axios.create({
//   baseURL,
//   headers: {
//     Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     // some accounts require one or the other; send both
//     Client: process.env.DELHIVERY_CLIENT_NAME,
//     'X-Delhivery-Client': process.env.DELHIVERY_CLIENT_NAME,
//   },
//   timeout: 15000,
// });

// console.log(`[Delhivery] Using baseURL: ${baseURL}`);
// module.exports = delhivery;


const axios = require('axios');

const baseURL = process.env.DELHIVERY_BASE_URL; // Only live URL

const delhivery = axios.create({
  baseURL,
  headers: {
    Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Client: process.env.DELHIVERY_CLIENT_NAME,
    'X-Delhivery-Client': process.env.DELHIVERY_CLIENT_NAME,
  },
  timeout: 15000,
});

console.log(`[Delhivery] Using LIVE baseURL: ${baseURL}`);
module.exports = delhivery;
