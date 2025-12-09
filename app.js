const express = require("express");
const app = express();
const path = require("path");

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "views"));
liveReloadServer.watch(path.join(__dirname, "public"));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => liveReloadServer.refresh("/"), 100);
});

app.use(connectLiveReload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Controllers
const AppointmentController = require("./controller/AppointmentController");
const PatientController = require("./controller/PatientController");
const Registration = require("./controller/Registration");

app.use("/appointments", AppointmentController);
app.use("/patients", PatientController);
app.use("/registration", Registration);

app.listen(process.env.PORT, () => {
  console.log(
    "Project URL: http://" + process.env.PROJECT_URL + ":" + process.env.PORT
  );
});
