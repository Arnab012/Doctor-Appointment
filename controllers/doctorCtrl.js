const doctorModel = require("../models/doctorModel");
const AppointmentModel = require("../models/AppointmentModel");
const userModel = require("../models/userModel");

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

exports.updateprofileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "something Went Wrong",
      error,
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).json({
      success: true,
      message: "Doctor Data Fetch SucessFully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "Something error in doctorList",
      error,
    });
  }
};

exports.getDoctorAppointment = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await AppointmentModel.find({
      doctorId: doctor._id,
    });

    res.status(200).json({
      success: true,
      message: "Appoint has been done Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error,
    });
  }
};

exports.appointmentsRequest = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await AppointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });

    const notification = user.notification;
    notification.push({
      type: "Status Updated",
      message: `You appointment has been Updated SucessFully ${status}`,
      onClickPath: "/doctor-appointments",
    }),
      await user.save();
    res.status(200).json({
      success: true,
      message: "Appointment has been Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Bad Request Status is not updated Something went Wrong",
      error,
    });
  }
};
