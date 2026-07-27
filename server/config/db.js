const dns = require("node:dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log("Host:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
  }
};

module.exports = connectDB;