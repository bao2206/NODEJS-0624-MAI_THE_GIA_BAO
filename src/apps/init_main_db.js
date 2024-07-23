const mongoose = require("mongoose");
class MainDB {
  async connection() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/test");
      console.log("Successfully connected");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MainDB();
