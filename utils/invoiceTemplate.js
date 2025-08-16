// module.exports = function generateInvoiceHTML(invoiceData) {
//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="utf-8" />
//     <style>
//       body {
//         font-family: 'Segoe UI', Tahoma, sans-serif;
//         padding: 30px;
//         background: #f8f9fa;
//         color: #333;
//       }
//       .invoice-box {
//         background: white;
//         max-width: 800px;
//         margin: auto;
//         padding: 30px;
//         border: 1px solid #eee;
//         box-shadow: 0 0 10px rgba(0,0,0,0.05);
//       }
//       .header {
//         text-align: center;
//         border-bottom: 2px solid #0d6efd;
//         padding-bottom: 10px;
//         margin-bottom: 20px;
//       }
//       .header h1 {
//         margin: 0;
//         font-size: 28px;
//         color: #0d6efd;
//       }
//       .header p {
//         margin: 2px 0;
//         font-size: 14px;
//         color: #666;
//       }
//       .invoice-details {
//         margin-bottom: 20px;
//       }
//       .invoice-details p {
//         margin: 4px 0;
//         font-size: 14px;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 15px;
//       }
//       table thead {
//         background: #0d6efd;
//         color: white;
//       }
//       table th, table td {
//         padding: 10px;
//         border: 1px solid #ddd;
//         font-size: 14px;
//       }
//       table tbody tr:nth-child(even) {
//         background: #f9f9f9;
//       }
//       .totals {
//         margin-top: 20px;
//         text-align: right;
//       }
//       .totals p {
//         font-size: 14px;
//         margin: 3px 0;
//       }
//       .totals p.grand-total {
//         font-size: 16px;
//         font-weight: bold;
//         color: #0d6efd;
//       }
//       .footer {
//         margin-top: 30px;
//         font-size: 12px;
//         text-align: center;
//         color: #888;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="invoice-box">
//       <div class="header">
//         <h1>My Store</h1>
//         <p>Invoice #${invoiceData.invoiceNumber}</p>
//       </div>
//       <div class="invoice-details">
//         <p><strong>Order Number:</strong> ${invoiceData.orderNumber}</p>
//         <p><strong>Customer:</strong> ${invoiceData.customerName}</p>
//         <p><strong>Email:</strong> ${invoiceData.customerEmail}</p>
//         <p><strong>Date:</strong> ${new Date(invoiceData.generatedAt).toLocaleDateString()}</p>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${invoiceData.items.map(item => `
//             <tr>
//               <td>${item.title}</td>
//               <td>${item.quantity}</td>
//               <td>₹${item.price.toFixed(2)}</td>
//               <td>₹${item.total.toFixed(2)}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//       <div class="totals">
//         <p>Subtotal: ₹${invoiceData.subtotal.toFixed(2)}</p>
//         <p>Tax: ₹${invoiceData.tax.toFixed(2)}</p>
//         <p>Shipping: ₹${invoiceData.shipping.toFixed(2)}</p>
//         <p>Discount: -₹${invoiceData.discount.toFixed(2)}</p>
//         <p class="grand-total">Grand Total: ₹${invoiceData.total.toFixed(2)}</p>
//       </div>
//       <div class="footer">
//         Thank you for shopping with us!  
//         This is a computer-generated invoice.
//       </div>
//     </div>
//   </body>
//   </html>
//   `;
// };

module.exports = function generateInvoiceHTML(invoiceData) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, sans-serif;
        background: #f4f6f8;
        padding: 25px;
        color: #333;
      }
      .invoice-container {
        background: #fff;
        max-width: 850px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        box-shadow: 0 3px 15px rgba(0,0,0,0.08);
      }
      /* Header */
      .invoice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #00695c;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .invoice-header img {
        max-height: 60px;
      }
      .invoice-header .store-info {
        text-align: right;
        font-size: 14px;
        color: #666;
      }
      /* Title Section */
      .invoice-title {
        text-align: center;
        margin-bottom: 25px;
      }
      .invoice-title h1 {
        margin: 0;
        font-size: 26px;
        color: #00695c;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .invoice-title p {
        margin: 4px 0;
        color: #777;
        font-size: 14px;
      }
      /* Order Details */
      .order-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .order-details div {
        font-size: 14px;
        line-height: 1.5;
      }
      /* Table */
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table thead {
        background: #00695c;
        color: #fff;
      }
      table th, table td {
        padding: 10px;
        border: 1px solid #ddd;
        font-size: 14px;
        text-align: left;
      }
      table tbody tr:nth-child(even) {
        background: #f9f9f9;
      }
      /* Totals */
      .totals {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .totals table {
        width: 300px;
      }
      .totals td {
        padding: 8px;
        font-size: 14px;
      }
      .totals .grand-total {
        font-weight: bold;
        color: #00695c;
        font-size: 16px;
      }
      /* Footer */
      .invoice-footer {
        margin-top: 30px;
        font-size: 12px;
        text-align: center;
        color: #888;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <!-- Header -->
      <div class="invoice-header">
        <div class="logo">
          <img src="https://yourwebsite.com/logo.png" alt="Triliv Logo" />
        </div>
        <div class="store-info">
          <strong>Triliv</strong><br/>
          123, Main Street, Your City<br/>
          support@triliv.com | +91-9876543210
        </div>
      </div>

      <!-- Title -->
      <div class="invoice-title">
        <h1>Invoice</h1>
        <p>Invoice #${invoiceData.invoiceNumber} | Order #${invoiceData.orderNumber}</p>
        <p>Date: ${new Date(invoiceData.generatedAt).toLocaleDateString()}</p>
      </div>

      <!-- Order Details -->
      <div class="order-details">
        <div>
          <strong>Billing To:</strong><br/>
          ${invoiceData.customerName}<br/>
          ${invoiceData.customerEmail}
        </div>
        <div>
          <strong>Payment Method:</strong><br/>
          ${invoiceData.paymentMethod}<br/>
          Status: ${invoiceData.paymentStatus}
        </div>
      </div>

      <!-- Items Table -->
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map(item => `
            <tr>
              <td>${item.title}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toFixed(2)}</td>
              <td>₹${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>₹${invoiceData.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td>₹${invoiceData.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td>₹${invoiceData.shipping.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Discount:</td>
            <td>-₹${invoiceData.discount.toFixed(2)}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td>₹${invoiceData.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div class="invoice-footer">
        Thank you for shopping with Triliv!<br/>
        This invoice is generated automatically and does not require a signature.
      </div>
    </div>
  </body>
  </html>
  `;
};

