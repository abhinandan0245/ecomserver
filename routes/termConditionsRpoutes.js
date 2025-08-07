const express = require("express");
const { createTermConditions, updateTermConditions, getTermConditions, deleteTermConditions } = require("../controllers/termConditionsController");



const router = express.Router();

router.post("/terms-conditions" , createTermConditions)
router.put("/terms-conditions/:id" , updateTermConditions)
router.get("/terms-conditions" , getTermConditions)
router.delete("/terms-conditions/:id" , deleteTermConditions)

module.exports = router;
// This code sets up routes for managing terms and conditions. It includes endpoints for creating, updating, retrieving, and deleting terms and conditions. The `createTermConditions`, `updateTermConditions`, `getTermConditions`, and `deleteTermConditions` functions are expected to handle the respective operations in the controller.