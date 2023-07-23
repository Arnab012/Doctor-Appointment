const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");

const AppointmentModel = require("../models/AppointmentModel");
const moment = require("moment");

exports.registerCtrl = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await userModel.findOne({ email: email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

exports.loginctrl = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.body.email })
      .select("+password");
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERETE, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

exports.getuserData = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.password = undefined;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data Fetch Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.applyDoctorController = async (req, res) => {
  try {
    const newdoctor = await doctorModel.create({
      ...req.body,
      status: "pending",
    });
    await newdoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-requesr",
      message: `${newdoctor.firstName} ${newdoctor.lastName} Has Appalied for A doctor Doctor Account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
        onclickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).json({
      success: true,
      message: "Doctor Account Appalied SucessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Appalying for a Doctor",
      error,
    });
  }
};

exports.applyDoctorNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    const seenNotification = user.seenNotification;

    const notification = user.notification;

    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const UpdatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: "All notificatios is marked as read",
      data: UpdatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Notification",
      error,
    });
  }
};

exports.deleteNotifictaion = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Messgae",
      error,
    });
  }
};

exports.getalldoctor = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).json({
      success: true,
      message: "Docotor Data Has been Fetch sucessfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Something went wrong in fetching Doctor list",
      error,
    });
  }
};

exports.bookappointmentsController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    req.body.status = "pending";
    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New Appoitments Request",
      message: `A new Appointmest request  from  ${req.body.userInfo.name}`,
      onclickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: " Appointments Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Something Error",
      error,
    });
  }
};

exports.bookaavabilityctrl = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const appointments = await AppointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Appointemets Not Avaliable at this time",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Appointmenst  Avaliable",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error,
    });
  }
};

exports.appointmentsCtrl = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).json({
      success: true,
      message: "The Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
