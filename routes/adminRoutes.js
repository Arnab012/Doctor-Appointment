const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getalluser,
  getalldoctors,
  chnageStatusCtrl,
} = require("../controllers/adminCtrl");

const router = express.Router();

router.get("/getalluserdetails", authMiddleware, getalluser);
router.get("/getalldoctorsdetails", authMiddleware, getalldoctors);

router.post("/changeAccountStatus", authMiddleware, chnageStatusCtrl);

module.exports = router;
