const express = require("express");
const cors = require("cors");
const students = require("./students");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Flutter Login API Running");
});

app.post("/login", (req, res) => {
  try {

    const { usn, password } = req.body;

    if (!usn || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    const student = students.find(
      (item) => item.USN.toLowerCase() === usn.toLowerCase()
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (password !== "Torii@123") {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
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
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});