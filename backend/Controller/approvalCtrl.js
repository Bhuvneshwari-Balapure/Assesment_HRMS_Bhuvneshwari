// controllers/approvalController.js
const Approval = require("../modal/Approval");

// GET /api/approvals?status=Pending
exports.getApprovals = async (req, res) => {
  try {
    const { status } = req.query;
    const q = {};
    if (status && status !== "All") q.status = status;
    const approvals = await Approval.find(q).sort({ createdAt: -1 });
    res.json(approvals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/approvals
exports.createApproval = async (req, res) => {
  try {
    const { employeeId, employeeName, requestType, details } = req.body;
    if (!employeeId || !employeeName || !requestType) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const approval = new Approval({
      employeeId,
      employeeName,
      requestType,
      details,
    });
    await approval.save();
    res.status(201).json({ success: true, approval });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/approvals/:id (change status)
exports.updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const approval = await Approval.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!approval)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, approval });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
