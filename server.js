const express = require("express");
const cors = require("cors");
const students = require("./students");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;





// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("Student API Running");
});





// ==========================================
// GET ALL STUDENTS
// ==========================================

app.get("/students", (req, res) => {

  return res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });

});





// ==========================================
// GET SINGLE STUDENT BY USN
// ==========================================

app.get("/students/:usn", (req, res) => {

  const usn = req.params.usn;

  const student = students.find(
    (item) => item.USN.toLowerCase() === usn.toLowerCase()
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });

});





// ==========================================
// LOGIN API
// ==========================================

app.post("/login", (req, res) => {

  try {

    const { usn, password } = req.body;

    if (!usn || !password) {
      return res.status(400).json({
        success: false,
        error: "Please fill all fields"
      });
    }

    const student = students.find(
      (item) => item.USN.toLowerCase() === usn.toLowerCase()
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    if (password !== "Torii@123") {
      return res.status(401).json({
        success: false,
        error: "Invalid password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: student
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }

});





// ==========================================
// ADD NEW STUDENT
// ==========================================

app.post("/students", (req, res) => {

  const {
    USN,
    Name,
    Branch
  } = req.body;

  if (!USN || !Name || !Branch) {
    return res.status(400).json({
      success: false,
      error: "Please provide all fields"
    });
  }

  const existingStudent = students.find(
    (item) => item.USN === USN
  );

  if (existingStudent) {
    return res.status(409).json({
      success: false,
      error: "Student already exists"
    });
  }

  const newStudent = {
    USN,
    Name,
    Branch
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: "Student added successfully",
    data: newStudent
  });

});





// ==========================================
// UPDATE COMPLETE STUDENT DATA
// PUT METHOD
// ==========================================

app.put("/students/:usn", (req, res) => {

  const usn = req.params.usn;

  const studentIndex = students.findIndex(
    (item) => item.USN.toLowerCase() === usn.toLowerCase()
  );

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }

  const {
    Name,
    Branch,
    LinkedIn,
    GitHub,
    LeetCode,
    HackerRank
  } = req.body;

  students[studentIndex] = {
    ...students[studentIndex],
    Name,
    Branch,
    LinkedIn,
    GitHub,
    LeetCode,
    HackerRank
  };

  return res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: students[studentIndex]
  });

});





// ==========================================
// PATCH METHOD
// PARTIAL UPDATE
// ==========================================

app.patch("/students/:usn", (req, res) => {

  const usn = req.params.usn;

  const student = students.find(
    (item) => item.USN.toLowerCase() === usn.toLowerCase()
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }

  Object.assign(student, req.body);

  return res.status(200).json({
    success: true,
    message: "Student partially updated",
    data: student
  });

});





// ==========================================
// DELETE STUDENT
// ==========================================

app.delete("/students/:usn", (req, res) => {

  const usn = req.params.usn;

  const studentIndex = students.findIndex(
    (item) => item.USN.toLowerCase() === usn.toLowerCase()
  );

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Student not found"
    });
  }

  const deletedStudent = students.splice(studentIndex, 1);

  return res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent[0]
  });

});





// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});