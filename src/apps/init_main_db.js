const mongoose = require("mongoose");
class MainDB {
  async connection() {
    try {
      await mongoose.connect(
        "mongodb+srv://baopro2206:22062002giabao@cluster0.kkoleaf.mongodb.net/"
      );
      console.log("Successfully connected");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MainDB();
