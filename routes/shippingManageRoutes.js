const exprress = require('express');
const router = exprress.Router();
const { createZone, getAllZones, updateZone, deleteZone, getZoneById, getZonesByCountry, getZonesByState, getZoneByZoneName, getZonesByMethodName, getZonesByEstimatedDate, getZonesByPrice, getZonesByType } = require('../controllers/shippingManageController');

router.post('/shipping-zone' , createZone); // Create a new shipping zone
router.get('/shipping-zones', getAllZones); // Get all shipping zones   
router.put('/shipping-zone/:id', updateZone); // Update a shipping zone by ID
router.delete('/shipping-zone/:id', deleteZone); // Delete a shipping zone by ID    
router.get('/shipping-zone/:id', getZoneById); // Get a shipping zone by ID
router.get('/shipping-zones/:country', getZonesByCountry); // Get all shipping zones by country
router.get('/shipping-zones/:state', getZonesByState); // Get all shipping zones by country and state  
router.get('/shipping-zones/:zone-name', getZoneByZoneName); // Get all shipping zones by  zone name
router.get('/shipping-zones/:method-name', getZonesByMethodName); // Get all shipping zones by method name
router.get('/shipping-zones/:estimated-date', getZonesByEstimatedDate); // Get all shipping zones by estimated date
router.get('/shipping-zones/:price', getZonesByPrice); // Get all shipping zones by price
router.get('/shipping-zones/:type', getZonesByType); // Get all shipping zones by type
// sreach shipping zone 
// router.get('/shipping-zones/search', searchShippingZones); // Search shipping zones by various criteria
module.exports = router;


// router.get('/shipping-zones/:country/:state/:type', getAllZones); // Get all shipping zones by country, state, and type
