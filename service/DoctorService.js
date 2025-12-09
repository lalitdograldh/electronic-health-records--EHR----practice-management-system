const pool = require("../db");

const DoctorService = {
  getAllDoctors() {
    return pool.query("SELECT doctor_id AS id, doctor_name FROM doctors");
  }
};

module.exports = DoctorService;
