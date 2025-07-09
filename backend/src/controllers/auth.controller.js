import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.validatedBody;
    const { profilePic = "" } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username is already taken",
      });
    }
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: "Email is already taken",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullname,
      profilePic,
    });


    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    return res.status(200).json({
      success: true,
      user:newUser
    });
  } catch (error) {
    console.error(`error in signup controller ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.validatedBody;
        const user = await User.findOne({ username });

        if (!user) {
          return res.status(400).json({
            success: false,
            error: "Invalid username or password",
          });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if (!isPasswordCorrect) {
          return res.status(400).json({
            success: false,
            error: "Invalid username or password",
          });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
          success: true,
          user:{
              username: user.username,
              fullname: user.fullname,
              email: user.email,
              profilePic: user.profilePic,
              _id:user._id,
              createdAt:user.createdAt,
              updatedAt:user.updatedAt,
              friends:user.friends,
          }
        });
    } 
    catch (error) {
        console.error(`error at signin controller ${error.message}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
};

export const testAccount = async(req,res) => {
    try {
        const username="zoropy";
        const password="zoro@123";
        const user = await User.findOne({ username });

        if (!user) {
          return res.status(400).json({
            success: false,
            error: "Invalid username or password",
          });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if (!isPasswordCorrect) {
          return res.status(400).json({
            success: false,
            error: "Invalid username or password",
          });
        }

        generateTokenAndSetCookie(user._id, res);

         return res.status(200).json({
          success: true,
          user:{
              username: user.username,
              fullname: user.fullname,
              email: user.email,
              profilePic: user.profilePic,
              _id:user._id
          }
        });
    } 
    catch (error) {
        console.error(`error at signin controller ${error.message}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
}


export const me = async (req,res) => {
    try {
        const user = req.user;
        console.log(user)
        return res.status(200).json({
            success:true,
            user:{
                username:user.username,
                email:user.email,
                fullname:user.fullname,
                profilePic:user.profilePic
            }
        })
    } catch (error) {
        console.error(`error in me controller ${error.message}`);
        return res.status(500).json({
            success:false,
            error:'Internal server error'
        })
    }
}



export const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"none",
            maxAge:0
        });

        return res.status(200).json({
            success:true,
            message:"Logged out successfully"
        });

    } catch (error) {
        console.error(`error in logout controller ${error.message}`);
        res.status(500).json({
            success:false,
            error:"Internal server error"
        });
    }
}

export const updateProfile = async (req,res) => {
    try {
        const userId = req.user._id;
        const {profilePic} = req.body;

        if(!profilePic){
          return res.status(400).json({
            success:false,
            error:"Profile pic is required"
          })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {profilePic:uploadResponse.secure_url},
          {new:true}
        ).select("-password");

        return res.status(200).json({
            success:true,
            updatedUser
        });
    } catch (error) {
        console.error(`error in updateProfile controller ${error.message}`)
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
}

export const checkAuth = async (req,res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success:true,
      user
    });
  } catch (error) {
    console.error(`error in checkAuth controller ${error}`);
    return res.status(500).json({
      success:false,
      error:"Internal server error"
    })
  }
}