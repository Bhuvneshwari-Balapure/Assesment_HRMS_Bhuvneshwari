const Approval = require("../modal/Approval");
const Employee = require("../modal/Employee");

exports.getAllRequests = async (_, res) => {
  try {
    const requests = await Approval.find();

    console.log("Fetched requests:", requests);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
