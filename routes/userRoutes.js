const express = require("express");
const {
  loginctrl,
  registerCtrl,
  getuserData,
  applyDoctorController,
  applyDoctorNotificationController,
  deleteNotifictaion,
  getalldoctor,
  bookappointmentsController,
  bookaavabilityctrl,
  appointmentsCtrl,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// register post

router.post("/register", registerCtrl);

// Login Post
router.post("/login", loginctrl);
router.post("/getUserData", authMiddleware, getuserData);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post(
  "/getallnotification",
  authMiddleware,
  applyDoctorNotificationController
);
router.post("/deleteallnotification", authMiddleware, deleteNotifictaion);

router.get("/getalldoctor", authMiddleware, getalldoctor);

router.post("/book-appointments", authMiddleware, bookappointmentsController);
router.post("/booking-avaliable", authMiddleware, bookaavabilityctrl);
router.get("/appointments", authMiddleware, appointmentsCtrl);

module.exports = router;
