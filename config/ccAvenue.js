// const crypto = require('crypto');
// require('dotenv').config();

// module.exports = {
//   merchantId: process.env.CCAVENUE_MERCHANT_ID,
//   accessCode: process.env.CCAVENUE_ACCESS_CODE,
//   workingKey: process.env.CCAVENUE_WORKING_KEY,
  
//   // Generate encrypted data for CC Avenue request
//   encrypt: (plainText) => {
//     const key = crypto.createHash('sha256').update(module.exports.workingKey).digest('binary');
//     const iv = Buffer.alloc(16, 0);
//     const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//     let encrypted = cipher.update(plainText, 'utf8', 'binary');
//     encrypted += cipher.final('binary');
//     return Buffer.from(encrypted, 'binary').toString('base64');
//   },

//   // Decrypt CC Avenue response
//   decrypt: (encryptedText) => {
//     const key = crypto.createHash('sha256').update(module.exports.workingKey).digest('binary');
//     const iv = Buffer.alloc(16, 0);
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//     let decrypted = decipher.update(Buffer.from(encryptedText, 'base64').toString('binary'), 'binary', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
//   }
// };

// const crypto = require('crypto');
// require('dotenv').config();

// module.exports = {
//   merchantId: process.env.CCAVENUE_MERCHANT_ID,
//   accessCode: process.env.CCAVENUE_ACCESS_CODE,
//   workingKey: process.env.CCAVENUE_WORKING_KEY,

//   // Generate encrypted data for CC Avenue request
//   encrypt: (plainText) => {
//     const key = crypto.createHash('sha256').update(module.exports.workingKey).digest(); // returns Buffer (length 32)
//     const iv = Buffer.alloc(16, 0);
//     const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//     let encrypted = cipher.update(plainText, 'utf8', 'base64');
//     encrypted += cipher.final('base64');
//     return encrypted;
//   },

//   // Decrypt CC Avenue response
//   decrypt: (encryptedText) => {
//     const key = crypto.createHash('sha256').update(module.exports.workingKey).digest();
//     const iv = Buffer.alloc(16, 0);
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//     let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
//   }
// };

// / config/ccAvenue.js
const crypto = require('crypto');

const merchantId = process.env.CCAVENUE_MERCHANT_ID;
const accessCode = process.env.CCAVENUE_ACCESS_CODE;
const workingKey = process.env.CCAVENUE_WORKING_KEY;
const baseUrl = process.env.CCAVENUE_PAYMENT_URL || 'https://test.ccavenue.com';

// CCAvenue uses AES-128-CBC with key = md5(workingKey), iv = 16 zero bytes.
function getKeyIV() {
  const key = crypto.createHash('md5').update(workingKey || '').digest();
  const iv = Buffer.alloc(16, 0);
  return { key, iv };
}

function encrypt(plainText) {
  const { key, iv } = getKeyIV();
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encHex) {
  const { key, iv } = getKeyIV();
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  merchantId,
  accessCode,
  baseUrl,
  encrypt,
  decrypt,
};