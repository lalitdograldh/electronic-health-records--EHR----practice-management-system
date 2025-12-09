const pool = require("../db");

const NotesService = {

  // GET notes for a patient
  getNotesByPatientId(patientId) {
    return pool.query(
      "SELECT * FROM notes WHERE patient_id = ? ORDER BY created_at DESC",
      [patientId]
    );
  },

  // ADD new note
  addNote(patientId, content, created_by) {
    return pool.query(
      "INSERT INTO notes (patient_id, note, created_by) VALUES (?, ?, ?)",
      [patientId, content, created_by]
    );
  }
};

module.exports = NotesService;
