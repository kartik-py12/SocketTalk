import User from "../models/User.model.js";
import Notification from "../models/notification.model.js";

export const addRemoveFriends = async (req,res) => {
    try {
        const {id} =req.params;
        const userToModiy = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id===req.user._id.toString()){
            return res.status(400).json({
                success:false,
                error:"You can't add yourself as friend"
            });
        }
        const isFriend = currentUser.friends.includes(id);

        if(isFriend){
            //unfriend the user
            await User.findByIdAndUpdate(id,{$pull:{friends:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{friends:id}});

            res.status(200).json({
                success:true,
                message:"user unfriended succefully"
            })
        }

        else{
            await User.findByIdAndUpdate(id,{$push:{friends:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{friends:id}});

            const newNotification = new Notification({
                type:"friend",
                from:req.user._id,
                to:userToModiy._id
            });

            await newNotification.save();

            return res.status(200).json({
                success:true,
                message:"User added as friend succefuly"
            })
        }
    } catch (error) {
        console.error(`error is addRemoveFriend Controller ${error}`);
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        });
    };
};