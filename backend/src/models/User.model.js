import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username:{
        type:String,
        required:true,
        unique:true
    }
    ,email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength:6,
    },
    profilePic: {
      type: String,
      default:"",
    },
    friends:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
      }
    ]
  },

  { timestamps: true }
);

const userModel = mongoose.model("User", UserSchema);

export default userModel;