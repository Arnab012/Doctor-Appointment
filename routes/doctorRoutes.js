const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getdocInfos,
  updateprofileController,
  getDoctorById,
  getDoctorAppointment,
  appointmentsRequest,
} = require("../controllers/doctorCtrl");

const router = express.Router();

// get single doc info
router.post("/getDoctoeInfo", authMiddleware, getdocInfos);

router.post("/updateProfile", authMiddleware, updateprofileController);
router.post("/getDoctorById", authMiddleware, getDoctorById);
router.get("/doctor-appointment", authMiddleware, getDoctorAppointment);
router.post("/doctor-request-uadte", authMiddleware, appointmentsRequest);

module.exports = router;
