const Approval = require("../modal/Approval");
const Employee = require("../modal/Employee");

// POST /api/employees/request
exports.createEmployeeRequest = async (req, res) => {
  try {
    const { email, type, reason, startDate, endDate, project } = req.body;

    if (!email || !type || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Construct details based on request type
    let details = reason;
    if (type === "Leave") {
      details += ` | From: ${startDate} To: ${endDate}`;
    } else if (type === "Project Change") {
      details += ` | New Project: ${project}`;
    }

    const approval = new Approval({
      employeeId: employee._id,
      employeeName: employee.name,
      requestType: type,
      details,
      status: "Pending",
      startDate: type === "Leave" ? startDate : null,
      endDate: type === "Leave" ? endDate : null,
      project: type === "Project Change" ? project : null,
    });

    await approval.save();

    res.status(201).json({ success: true, approval });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/employees/requests/:email
exports.getEmployeeRequests = async (req, res) => {
  try {
    const { email } = req.params;
    const employee = await Employee.findOne({ email });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const requests = await Approval.find({ employeeId: employee._id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all requests (HR)
// exports.getAllRequests = async (req, res) => {
//   try {
//     const requests = await Approval.find()
//       .populate("employeeId") // optional: fetch employee info
//       .sort({ createdAt: -1 });
//     console.log("Fetched requests:", requests);
//     res.json(requests);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// Update request status (HR only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Approval.findById(id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    request.status = status;
    request.updatedAt = new Date();
    await request.save();

    res.json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
