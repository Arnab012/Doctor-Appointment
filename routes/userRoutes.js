const express = require("express");
const {
  loginctrl,
  registerCtrl,
  getuserData,
  applyDoctorController,
  applyDoctorNotificationController,
  getAllNotificationController,
  deleteNotifictaion,
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

module.exports = router;
