const pool = require("../db");
const PatientService = {
  
  // Get all patients or search by name
  getAllPatients(name) {
    if (name) {
      return pool.query(
        "SELECT * FROM patients WHERE name LIKE ?",
        [`%${name}%`]
      );
    }
    return pool.query("SELECT * FROM patients");
  },

  // Get patient by id
  getPatientById(id) {
    return pool.query("SELECT * FROM patients WHERE id = ?", [id]);
  },

  // Update patient
  updatePatientById(id, data) {
    return pool.query(
      "UPDATE patients SET name=?, contactDetails=?, address=?, email=?, gender=?, dob=?, medicalHistory=? WHERE id=?",
      [
        data.name,
        data.contactDetails,
        data.address,
        data.email,
        data.gender,
        data.dob,
        data.medicalHistory,
        id,
      ]
    );
  }
};

module.exports = PatientService;
