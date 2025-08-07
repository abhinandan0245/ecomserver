// const nodemailer = require('nodemailer');

// const sendInvoiceEmail = async (email, invoicePath, invoiceNumber) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"My Store" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: `Your Invoice - ${invoiceNumber}`,
//     text: 'Thank you for your purchase. Please find your invoice attached.',
//     attachments: [
//       {
//         filename: `${invoiceNumber}.pdf`,
//         path: invoicePath,
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendInvoiceEmail;



// utils/sendInvoiceEmail.js
const nodemailer = require('nodemailer');

const sendInvoiceEmail = async (toEmail, invoicePath, invoiceNumber) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"My Store" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Your Invoice - ${invoiceNumber}`,
      text: 'Thank you for your purchase. Please find your invoice attached.',
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          path: invoicePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};

module.exports = sendInvoiceEmail;
