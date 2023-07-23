const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./config/db");

// const path = require("path");

dotenv.config();

connectToMongo();

const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoute = require("./routes/doctorRoutes");
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoute);

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(process.env.PORT, () => {
  console.log(
    `Server is Running in ${process.env.DEV_MODE} mode on  port ${process.env.PORT}`
  );
});
