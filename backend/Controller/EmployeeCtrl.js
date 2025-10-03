// controllers/employeeController.js
const Employee = require("../modal/Employee");
const sendMail = require("./mailer");
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

    // generate password if not provided
    const autoPassword = password || Math.random().toString(36).slice(-8);

    const employee = new Employee({
      code: newCode,
      name,
      doj,
      dept,
      proj,
      email,
      password: autoPassword, // store (hash this if needed!)
      addedBy: "HR",
    });

    await employee.save();

    // send email with password
    await sendMail(
      email,
      "Welcome to the Company 🎉",
      `Hi ${name},\n\nYour account has been created.\nEmployee Code: ${newCode}\nPassword: ${autoPassword}\n\nPlease change your password after first login.`,
      `<h3>Hi ${name},</h3>
       <p>Your account has been created successfully.</p>
       <p><b>Employee Code:</b> ${newCode}</p>
       <p><b>Employee Email:</b> ${email}</p>
       <p><b>Password:</b> ${autoPassword}</p>
       <p>Please Login your Employee account </p>`
    );

    res.status(201).json({ success: true, employee });
  } catch (err) {
    console.error(err);
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

// POST employee login
exports.employeeLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email & password required" });

  try {
    const employee = await Employee.findOne({ email });
    if (!employee)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    // NOTE: Use bcrypt.compare in production
    if (employee.password !== password)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const token = Math.random().toString(36).substring(2, 15); // simple token
    res.json({ success: true, user: employee, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET employee by email
exports.getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const emp = await Employee.findOne({ email });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
