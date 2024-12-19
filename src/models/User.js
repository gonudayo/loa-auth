const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  server: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  secureCode: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
