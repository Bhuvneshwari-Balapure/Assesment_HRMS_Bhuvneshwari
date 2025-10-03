const express = require("express");
const router = express.Router();
const employeeController = require("../Controller/EmployeeCtrl");

// GET all employees
router.get("/", employeeController.getEmployees);

// POST new employee
router.post("/", employeeController.addEmployee);
router.put("/:id", employeeController.updateEmployee); // PUT update employee
router.delete("/:id", employeeController.deleteEmployee); // DELETE employee

module.exports = router;
