const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."],
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please chooose a password."],
    minlength: 4,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (inputedPass) {
  return await bcrypt.compare(inputedPass, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
