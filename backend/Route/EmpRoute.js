const express = require("express");
const router = express.Router();
const employeeController = require("../Controller/EmployeeCtrl");
const approvalController = require("../Controller/approvalCtrl");

// GET all employees
router.get("/", employeeController.getEmployees);

// POST new employee
router.post("/", employeeController.addEmployee);
router.put("/:id", employeeController.updateEmployee); // PUT update employee
router.delete("/:id", employeeController.deleteEmployee); // DELETE employee

// Employee login & fetch
router.post("/login", employeeController.employeeLogin);
router.get("/:email", employeeController.getEmployeeByEmail);

// Employee request routes
router.post("/request", approvalController.createEmployeeRequest);

// Employee request routes for the specific employee
router.get("/requests/:email", approvalController.getEmployeeRequests);

// HR: Update request status
router.put("/approvals/:id", approvalController.updateRequestStatus);

module.exports = router;
