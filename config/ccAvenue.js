const crypto = require('crypto');
require('dotenv').config();

module.exports = {
  merchantId: process.env.CCAVENUE_MERCHANT_ID,
  accessCode: process.env.CCAVENUE_ACCESS_CODE,
  workingKey: process.env.CCAVENUE_WORKING_KEY,
  
  // Generate encrypted data for CC Avenue request
  encrypt: (plainText) => {
    const key = crypto.createHash('sha256').update(module.exports.workingKey).digest('binary');
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'binary');
    encrypted += cipher.final('binary');
    return Buffer.from(encrypted, 'binary').toString('base64');
  },

  // Decrypt CC Avenue response
  decrypt: (encryptedText) => {
    const key = crypto.createHash('sha256').update(module.exports.workingKey).digest('binary');
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(Buffer.from(encryptedText, 'base64').toString('binary'), 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};