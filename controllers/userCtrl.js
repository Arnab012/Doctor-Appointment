const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");

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
