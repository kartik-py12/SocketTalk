import { User, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
    const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

     const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full  w-20 lg:w-72 md:w-52 flex flex-col ">
            <div className="w-full p-5 pl-7 md:pl-5">
                <div className="flex items-center gap-2 ">
                    <Users className="  size-6" />
                    <span className="hidden md:block font-semibold">Contacts</span>
                </div>

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        ({onlineUsers.length - 1} online)
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto w-full  py-3">
                {filteredUsers.map((user, index) => (
                    <button
                        key={user._id || index}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id
                                ? "bg-base-300 ring-1 ring-base-300"
                                : ""
                            }
                        `}
                    >
                        <div className="relative lg:mx-0">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic || "/batman.jpg"}
                                    alt={user.username}
                                    className="size-12 object-cover rounded-full"
                                />
                            ) : (
                                <div className="bg-primary uppercase text-2xl flex items-center justify-center size-12 rounded-full text-base-300 font-medium">
                                    {user.fullname[0]}
                                </div>
                            )}

                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>
                            )}
                        </div>

                        <div className="hidden md:block text-left min-w-0">
                            <div className="font-medium truncate capitalize">
                                {user.fullname}
                            </div>
                            <div className="text-sm text-zinc-400">{ }</div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default SideBar;
