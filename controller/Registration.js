const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /registration
router.get("/", (req, res) => {
  res.render("registration-form", { error: null });
});

// POST /registration
router.post("/", async (req, res) => {
  const { name, contactDetails, address, email, gender, dob, medicalHistory } = req.body;

  // Server-side validation
  if (!name || !contactDetails || !address || !email || !gender || !dob || !medicalHistory) {
    return res.render("registration-form", { error: "All fields are required!" });
  }

  try {
    // Check if contactDetails or email already exists
    const checkQuery = `
      SELECT * FROM patients 
      WHERE contactDetails = ? OR email = ?
      LIMIT 1
    `;
    const [existing] = await pool.query(checkQuery, [contactDetails, email]);

    if (existing.length > 0) {
      if (existing[0].contactDetails === contactDetails) {
        return res.render("registration-form", { error: "This contact details is already registered!" });
      }
      if (existing[0].email === email) {
        return res.render("registration-form", { error: "This email is already registered!" });
      }
    }

    // Insert new patient
    const insertQuery = `
      INSERT INTO patients (name, contactDetails, address, email, gender, dob, medicalHistory)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [name, contactDetails, address, email, gender, dob, medicalHistory]);

    res.redirect("/patients");
  } catch (err) {
    console.error(err);
    res.render("registration-form", { error: "Failed to register patient. Try again." });
  }
});

module.exports = router;
