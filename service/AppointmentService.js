const pool = require("../db");

const AppointmentService = {

    // Get all appointments for a patient
    getAppointmentsByPatient(patientId) {
        return pool.query(
            "SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC",
            [patientId]
        );
    },

    // Insert one appointment
    
    addAppointment({
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
}) {
        return pool.query(
            `INSERT INTO appointments (patient_id, patient_name, age, purpose, doctor_id, department_id, email, appointment_date, appointment_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [patientId, patientName, age, purpose, doctorName, select_department, email, appointmentDate, timeSlot, createdBy]
        );
        
    },

    // Get one appointment by id
    getAppointmentById(appointmentId) {
        return pool.query(
            "SELECT * FROM appointments WHERE id = ?",
            [appointmentId]
        );
    },

    // Reschedule appointment (update date and time)
    updateAppointment(appointmentId, newDate, newTime) {
        return pool.query(
            "UPDATE appointments SET appointment_date = ?, time_slot = ? WHERE id = ?",
            [newDate, newTime, appointmentId]
        );
    },

    // Update full appointment details (optional, if you want to edit all fields)
    updateAppointmentDetails(appointmentId, patientName, age, purpose, doctorId, departmentId, email, date, time, createdBy, notes) {
        return pool.query(
            `UPDATE appointments 
       SET patient_name = ?, age = ?, purpose = ?, doctor_id = ?, department_id = ?, email = ?, appointment_date = ?, time_slot = ?, created_by = ?, notes = ?
       WHERE id = ?`,
            [patientName, age, purpose, doctorId, departmentId, email, date, time, createdBy, notes, appointmentId]
        );
    },

    // Delete appointment
    deleteAppointment(appointmentId) {
        return pool.query(
            "DELETE FROM appointments WHERE id = ?",
            [appointmentId]
        );
    }
};

module.exports = AppointmentService;
