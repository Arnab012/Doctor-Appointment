const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./config/db");

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

app.listen(process.env.PORT, () => {
  console.log(
    `Server is Running in ${process.env.DEV_MODE} mode on  port ${process.env.PORT}`
  );
});
