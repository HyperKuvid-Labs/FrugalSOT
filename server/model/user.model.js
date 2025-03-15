import mongoose, { Document, Schema } from "mongoose";

// const UserSchema = new Schema<UserI>({
//     userId : {type : String, required : true, unique : true},
//     name : {type : String, required : true},
//     email : {type : String, required : true, unique : true},
//     password : {type : String, required : true},
//     createdAt : {type : Date, default : Date.now}
// });

// const User = mongoose.model<UserI>('User',UserSchema);

// export default User;

// import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
