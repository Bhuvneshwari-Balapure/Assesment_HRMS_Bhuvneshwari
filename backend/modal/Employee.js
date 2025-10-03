// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  doj: { type: Date, required: true },
  dept: { type: String, required: true },
  proj: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed in prod
  addedDate: { type: Date, default: Date.now },
  addedBy: { type: String },
});

module.exports = mongoose.model("Employee", employeeSchema);
