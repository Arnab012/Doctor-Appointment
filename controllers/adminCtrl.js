const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

exports.getalluser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      success: true,
      message: "user is Fetch SuucessFully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error,
    });
  }
};

exports.getalldoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).json({
      success: true,
      message: "Doctor has been fecth successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal Server Error",
      error,
    });
  }
};

exports.chnageStatusCtrl = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-accout-request-updated",
      message: `Your doctor Account has ${status}`,
      onClickPath: "/notitication",
    });

    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).json({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal Server Error",
      error,
    });
  }
};
