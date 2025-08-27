// services/DelhiveryService.js
const axios = require('axios');
const deliveryConfig = require('../config/Delivery');

class DelhiveryService {
  constructor() {
    this.config = deliveryConfig.delhivery;
    this.baseUrl = this.config.sandbox 
      ? 'https://staging-express.delhivery.com' 
      : 'https://track.delhivery.com';
  }

  // Get shipping rates
  async getShippingRates(orderDetails) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/kinko/v1/invoice/charges/.json`,
        {
          params: {
            md: this.config.clientName,
            ss: orderDetails.deliveryPincode,
            d_pin: orderDetails.deliveryPincode,
            o_pin: orderDetails.pickupPincode,
            cgm: orderDetails.weight,
            pt: orderDetails.paymentType || 'Pre-paid'
          },
          headers: {
            'Authorization': `Token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Delhivery rates error: ${error.message}`);
    }
  }

  // Create shipment
  async createShipment(orderData) {
    try {
      const shipmentData = {
        shipments: [{
          name: orderData.customerName,
          add: orderData.address,
          city: orderData.city,
          pin: orderData.pincode,
          state: orderData.state,
          country: orderData.country || 'India',
          phone: orderData.phone,
            order: orderData.orderId,
            payment_mode: orderData.paymentMode,
            return_pin: orderData.returnPincode,
            return_city: orderData.returnCity,
            return_phone: orderData.returnPhone,
            return_add: orderData.returnAddress,
            return_state: orderData.returnState,
            return_country: orderData.returnCountry || 'India',
            products_desc: orderData.productDescription,
            hsn_code: orderData.hsnCode,
            cod_amount: orderData.codAmount,
            order_date: orderData.orderDate,
            total_amount: orderData.totalAmount,
            seller_add: orderData.sellerAddress,
            seller_name: orderData.sellerName,
            seller_inv: orderData.invoiceNumber,
            quantity: orderData.quantity,
            waybill: orderData.waybillNumber
        }]
      };

      const response = await axios.post(
        `${this.baseUrl}/api/cmu/create.json`,
        shipmentData,
        {
          headers: {
            'Authorization': `Token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Delhivery shipment creation error: ${error.message}`);
    }
  }

  // Track shipment
  async trackShipment(waybillNumber) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/packages/json/`,
        {
          params: {
            waybill: waybillNumber,
            token: this.config.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Delhivery tracking error: ${error.message}`);
    }
  }

  // Generate AWB
  async generateAWB(count = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/waybill/api/bulk/json/`,
        {
          params: {
            count: count,
            token: this.config.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Delhivery AWB generation error: ${error.message}`);
    }
  }

  // Create pickup request
  async createPickup(pickupData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/fm/request/new/`,
        {
          pickup_location: pickupData.location,
          pickup_pin: pickupData.pincode,
          pickup_time: pickupData.pickupTime,
          pickup_date: pickupData.pickupDate,
          pickup_phone: pickupData.phone,
          expected_package_count: pickupData.packageCount
        },
        {
          headers: {
            'Authorization': `Token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Delhivery pickup creation error: ${error.message}`);
    }
  }

  // Cancel shipment
  async cancelShipment(waybillNumber) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/p/edit`,
        {
          waybill: waybillNumber,
          cancellation: true
        },
        {
          headers: {
            'Authorization': `Token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Delhivery cancellation error: ${error.message}`);
    }
  }
}

module.exports = DelhiveryService;
