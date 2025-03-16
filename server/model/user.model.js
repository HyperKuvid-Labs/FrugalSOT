import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authProvider: { type: String, default: "local" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
