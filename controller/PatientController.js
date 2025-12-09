const express = require("express");
const router = express.Router();

const PatientService = require("../service/PatientService");
const AppointmentService = require("../service/AppointmentService");
const NotesService = require("../service/NotesService");


// -------------------------------------------------------
// GET /patients - Search Patients
// -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    const [patients] = await PatientService.getAllPatients(name);

    res.render("patient-search", {
      patients,
      searchQuery: name || "",
    });
  } catch (err) {
    console.error(err);
    res.render("patient-search", {
      patients: [],
      searchQuery: "",
      error: "Failed to fetch patients.",
    });
  }
});


// -------------------------------------------------------
// GET /patients/:id - Patient Details Page
// -------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const [rows] = await PatientService.getPatientById(patientId);

    res.render("patient-details", {
      patient: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.render("patient-details", {
      patient: null,
      error: "Patient not found.",
    });
  }
});


// -------------------------------------------------------
// GET /patients/edit/:id - Edit Patient Form
// -------------------------------------------------------
router.get("/edit/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const [rows] = await PatientService.getPatientById(patientId);

    res.render("edit-patient", {
      patient: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
});


// -------------------------------------------------------
// POST /patients/update/:id - Update Patient
// -------------------------------------------------------
router.post("/update/:id", async (req, res) => {
  const patientId = req.params.id;
  const { name, contactDetails, address, email, gender, dob, medicalHistory } =
    req.body;

  let errors = [];

  if (!name) errors.push("Name is required");
  if (!contactDetails) errors.push("Contact number is required");
  if (!email || !email.includes("@")) errors.push("Valid email is required");
  if (!dob) errors.push("Date of birth is required");

  if (errors.length > 0) {
    const [rows] = await PatientService.getPatientById(patientId);
    return res.render("edit-patient", {
      patient: rows[0],
      errors,
    });
  }

  try {
    await PatientService.updatePatientById(patientId, {
      name,
      contactDetails,
      address,
      email,
      gender,
      dob,
      medicalHistory,
    });

    res.render("message-page", {
      title: "Success",
      message: "Patient updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res.render("message-page", {
      title: "Error",
      message: "Failed to update patient.",
    });
  }
});


// -------------------------------------------------------
// NOTES SECTION
// -------------------------------------------------------

// View Notes
router.get("/notes/view/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    const [notes] = await NotesService.getNotesByPatientId(patientId);

    res.render("notes-page", {
      patientId,
      notes: notes || [],
    });
  } catch (err) {
    console.error(err);
    res.render("notes-page", {
      patientId,
      notes: [],
    });
  }
});

// Add Note Form
router.get("/notes/add/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const [rows] = await PatientService.getPatientById(patientId);

    if (!rows.length) {
      return res.status(404).send("Patient not found");
    }

    res.render("add-note", {
      patientId,
      username: rows[0].name,
      patient: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading add-note form");
  }
});

// Save Note
router.post("/notes/add/:id", async (req, res) => {
  const patientId = req.params.id;
  const { content, created_by } = req.body;

  try {
    await NotesService.addNote(patientId, content, created_by);

    res.redirect(`/patients/notes/view/${patientId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving note");
  }
});


// -------------------------------------------------------
// APPOINTMENTS SECTION
// -------------------------------------------------------

router.get("/appointments/:patientId", async (req, res) => {
  const patientId = req.params.patientId;

  try {
    // Fetch patient info
    const [patientRows] = await PatientService.getPatientById(patientId);
    if (!patientRows.length) return res.status(404).send("Patient not found");

    const patient = patientRows[0];

    // Fetch appointments for the patient
    const [appointments] = await AppointmentService.getAppointmentsByPatient(patientId);

    res.render("appointmentList", {
      patient,
      appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching appointments");
  }
});

router.get("/appointments/add/:patientId", async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const [rows] = await PatientService.getPatientById(patientId);
    if (!rows.length) return res.status(404).send("Patient not found");
    const patient = rows[0];

    res.render("appointmentForm", {
      patient
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading form");
  }
});
// Handle Add Appointment Form submission
router.post("/appointments/add/:patientId", async (req, res) => {
  const patientId = req.params.patientId;
  const { doctorName, select_department,appointmentDate, timeSlot, age, email, purpose, createdBy } = req.body;
  try {
    // Get patient name from DB
    const [rows] = await PatientService.getPatientById(patientId);
    if (!rows.length) return res.status(404).send("Patient not found");

    const patientName = rows[0].name;

    // Add appointment
    await AppointmentService.addAppointment({ 
    patientId,
    patientName,
    age,
    purpose,
    doctorName,
    select_department,
    email,
    appointmentDate,
    timeSlot,
    createdBy
});
    res.redirect(`/patients/appointments/${patientId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding appointment");
  }
});

// Reschedule Form  
router.get("/appointment/reschedule/:appointmentId", async (req, res) => {
  const appointmentId = req.params.appointmentId;
  res.render("rescheduleForm", { appointmentId });
});

// Save Reschedule
router.post("/appointment/reschedule/:appointmentId", async (req, res) => {
  res.render("message-page", {
    title: "Success",
    message: "Appointment rescheduled!",
  });
});

// Delete Appointment
router.post("/appointment/delete", async (req, res) => {
  try {
    const appointmentId = req.body.appointment_id;
    const patientId = req.body.patient_id;

    await AppointmentService.deleteAppointment(appointmentId);

    res.redirect(`/patients/${patientId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting appointment");
  }
});


// -------------------------------------------------------
module.exports = router;
