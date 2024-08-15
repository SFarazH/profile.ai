const mongoose = require("mongoose");

async function dbConnect() {
  console.log(`connecting to ${process.env.DB_URL}....`);
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected Successfully"))
    .catch((error) => console.log("Failed to connect", error));
}

module.exports = { dbConnect };
