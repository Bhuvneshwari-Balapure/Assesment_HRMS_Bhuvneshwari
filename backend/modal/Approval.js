const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: { type: String, required: true },
  requestType: { type: String, required: true },
  details: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  project: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Approval", approvalSchema);
