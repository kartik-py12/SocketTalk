import { success } from "zod/v4";
import User from "../models/User.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req,res) => {
    try {
        const currentUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:currentUserId}}).select("-password");
        
        res.status(200).json({
            success:true,
            filteredUser
        })

    } catch (error) {
        console.error(`error in getUsersForSidebar controller ${error}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        });
    }
}

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const senderId=req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:senderId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:senderId}
            ]
        })

        return res.status(200).json({
            success:true,
            messages
        });

    } catch (error) {
        console.error(`error in getMessages controller ${error}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        });
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {text,image}=req.body;
        const {id:receiverId} = req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        //TODO: real time functionality goes here => socket.io

        const receiverSocketId= getReceiverSocketId(receiverId);
        if(receiverId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json({
            success:true,
            newMessage
        })
        
    } catch (error) {
        console.error(`error in sendMessage controller ${error}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
}