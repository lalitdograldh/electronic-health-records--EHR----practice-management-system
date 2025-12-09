const express = require("express");
const router = express.Router();
const AppointmentService = require("../service/AppointmentService");
router.get("/schedule", async (req, res) => {
  res.render("appointmentForm");
});
router.post("/schedule", async (req, res) => {
  res.redirect(`/patients`);
});
router.post("/reminders", async (req, res) => {
  res.render("message-page");
});
module.exports = router;
