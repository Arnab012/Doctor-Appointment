const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { getdocInfos } = require("../controllers/doctorCtrl");

const router = express.Router();

// get single doc info
router.post("/getDoctoeInfo", authMiddleware, getdocInfos);

module.exports = router;
