const express = require("express");
const router = express.Router();
const approvalController = require("../Controller/EmpReq");

// Only HR: Get all requests
router.get("/approvals", approvalController.getAllRequests);

module.exports = router;
