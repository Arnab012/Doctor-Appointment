const doctorModel = require("../models/doctorModel");

exports.getdocInfos = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).json({
      success: true,
      message: "Doctor Data fetch Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while Fetchiing Doc Data",
      error,
    });
  }
};
