import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export  const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async () => { 
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("message/users");
            if(res.data.success===true){
                set({users:res.data.filteredUser});
            }
        } catch (error) {
            toast.error(error.response.data.error)
            // console.log(error);
            console.log(`error in getting users ${error.message}`);
        } finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            if(res.data.success===true){
                set({messages:res.data.messages})
            }
        } catch (error) {
            toast.error(error.response.data.error);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    
    
    sendMessage: async(messageData) => {
        const {selectedUser,messages} = get();
        console.log(selectedUser)
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            if(res.data.success===true){
                set({messages: [...messages,res.data.newMessage]});
            }
        } catch (error) {
            toast.error(error.response.data.error);
        }
    },
    
    //TODO: optimize it later

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages,newMessage]
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),


}))