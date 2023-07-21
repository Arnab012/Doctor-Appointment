const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGODB_URI, { dbName: "Doctor-Appoinment-app" })
    .then((data) => {
      console.log(
        `Database Connected Successfully with ${data.connection.host}`
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectToMongo;
