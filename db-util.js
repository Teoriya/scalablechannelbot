const mongoose = require("mongoose");

function dbConnect() {
  return new Promise((resolve, reject) => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env["MONGO_URI"] || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error("Connection error:", error);
      reject(error);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB");
      resolve();
    });
  });
}

module.exports = dbConnect;