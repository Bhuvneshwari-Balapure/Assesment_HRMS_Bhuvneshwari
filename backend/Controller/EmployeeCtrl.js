// controllers/employeeController.js
const Employee = require("../modal/Employee");

// Helper to compute smallest missing EMP number
const getNextEmpCode = (employees) => {
  const numbers = employees
    .map((e) => {
      const m = String(e.code || "").match(/EMP0*([0-9]+)/i);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  let codeNumber = 1;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== codeNumber) break;
    codeNumber++;
  }
  return `EMP${String(codeNumber).padStart(3, "0")}`;
};

// GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ code: 1 }); // sorting by code string ok
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/employees
exports.addEmployee = async (req, res) => {
  try {
    const { name, doj, dept, proj, email, password } = req.body;
    if (!name || !doj || !dept || !proj || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // fetch all existing employees to find gaps
    const all = await Employee.find({}, { code: 1 }).lean();
    const newCode = getNextEmpCode(all);

    const employee = new Employee({
      code: newCode,
      name,
      doj,
      dept,
      proj,
      email,
      password: password || Math.random().toString(36).slice(-8), // default auto pw
      addedBy: "HR",
    });

    await employee.save();
    res.status(201).json({ success: true, employee });
  } catch (err) {
    console.error(err);
    // duplicate email/code handling
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate field" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const emp = await Employee.findByIdAndUpdate(id, updates, { new: true });
    if (!emp)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, employee: emp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findByIdAndDelete(id);
    if (!emp)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
