import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const {isUpdatingProfile,authUser,updateProfile} = useAuthStore();
  const [selectedImg,setSelectedImg] = useState(null);

  // const isUpdatingProfile = true;
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic:base64Image});
    };
  };

  return (
    <div className="pt-20 min-h-screen  ">
      <div className="max-w-2xl mx-auto p-4 py-8 ">
        <div className=" bg-base-300 rounded-xl p-6 space-y-8 ">
          <div className="text-center text-primary">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
            
          </div>


          {/* avatar section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img src={selectedImg || authUser.profilePic || "avatar.png"} alt="Profile" className="size-32 rounded-full object-cover border-4 "/>
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-300 hover:scale-105 cursor-pointer  p-2 rounded-full  transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}>
                <Camera className="size-5 " />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile}/>
              </label>
    
            </div>
            <div className="flex items-center space-x-1  ">

              <div className="bg-base-200 flex items-center space-x-3  py-1.5  px-2 border border-primary rounded-lg cursor-pointer">
              <User className="size-5"/>
              <p>{authUser?.username}</p>
              </div>
            </div>
            <p>{isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="size-4"/>
              Full Name
            </div>
            <p className="rounded-lg border capitalize border-primary bg-base-200 px-4 py-2.5    ">{authUser?.fullname}</p>
          </div> 

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="size-4"/>
              Email Address
            </div>
            <p className="rounded-lg border border-primary bg-base-200 px-4 py-2.5    ">{authUser?.email}</p>
          </div> 
        </div>

        <div className="rounded-xl bg-base-300 mt-6 p-6">
          <h2 className="text-lg font-medium mb-4 text-primary">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2 ">
              <span>Account Status</span>
              <span className="text-green-500 ">Active</span>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default ProfilePage;
