import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
                {selectedUser.profilePic ? 
                  <img
                    src={selectedUser.profilePic || "/batman.jpg"} 
                    alt={selectedUser.username} 
                    className="size-10 object-cover rounded-full" 
                  /> : 
                  <div 
                    className="bg-primary uppercase text-2xl flex items-center justify-center size-10 rounded-full text-base-300 font-medium">{selectedUser.fullname[0]}
                  </div>}
              {/* <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} /> */}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium capitalize">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;