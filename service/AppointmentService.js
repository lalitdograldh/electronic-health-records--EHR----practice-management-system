const pool = require("../db");

const AppointmentService = {

    // Get all appointments for a patient
    getAppointmentsByPatient(patientId) {
        return pool.query(
            `
            SELECT 
                a.*, 
                d.doctor_name
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC
            `,
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
    deleteAppointment(appointmentId) {
        return pool.query(
            `DELETE FROM appointments WHERE id = ?`,
            [appointmentId]
        );
    },

    // Reschedule appointment (update date and time)
    // updateAppointment(appointmentId, newDate, newTime) {
    //     return pool.query(
    //         "UPDATE appointments SET appointment_date = ?, time_slot = ? WHERE id = ?",
    //         [newDate, newTime, appointmentId]
    //     );
    // },

    // Update full appointment details (optional, if you want to edit all fields)
    updateAppointmentDetails({
        purpose,
        doctorName,
        appointmentDate,
        timeSlot,
        appointmentId
    }) {

        return pool.query(
            `UPDATE appointments 
         SET purpose = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?
         WHERE id = ?`,
            [purpose, doctorName, appointmentDate, timeSlot, appointmentId]
        );
    }


};

module.exports = AppointmentService;
