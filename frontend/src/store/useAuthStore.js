import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.Mode ==="development" ? "http://localhost:5001/api" : "/api "

export const useAuthStore = create((set,get) => ({
    authUser:null,
    isSigningUp:false,
    isSigningIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data.user});
            get().connectSocket();

        } catch (error) {
            // console.log("Auth check failed:", error.message);
            set({authUser: null});
        } finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp:true});
        try {
            // The form data already has the correct field names matching the backend
            const res = await axiosInstance.post("/auth/signup", data);
            console.log(res);
            if(res.data.success){
                set({authUser:res.data})
                toast.success("Account created successfully");

                get().connectSocket();
            }
        } catch (error) {
            console.error("Signup error:", error);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorData = error.response.data;
                
                if (errorData.error) {
                    if (Array.isArray(errorData.error)) {
                        // Handle Zod validation errors (array of error objects)
                        errorData.error.forEach(error => {
                            // Format the path array to a readable string
                            const fieldName = Array.isArray(error.path) ? error.path.join('.') : error.path;
                            const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                            
                            toast.error(`${capitalizedField}: ${error.message}`);
                        });
                        
                    } else if (typeof errorData.error === 'string') {
                        // Handle single error message (like "Username is already taken")
                        toast.error(errorData.error);
                    } else {
                        toast.error("Validation failed. Please check your input.");
                    }
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } else if (error.request) {
                // Network error or no response from server
                toast.error("Network error. Please check your connection.");
            } else {
                // Other errors
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isSigningUp:false});
        }
    },


    signin: async (data) => {
        set({isSigningIn:true});
        try {
            const res = await axiosInstance.post("/auth/signin",data);
            if(res.data.success){
                set({authUser:res.data.user});
                toast.success("Signed In successfully")

                get().connectSocket();
            }
        } catch (error) {
            // Handle different types of errors
            console.error("Signin error:", error);

            if (error.response) {
                // Server responded with error status
                const errorData = error.response.data;
                
                if (errorData.error) {
                    if (Array.isArray(errorData.error)) {
                        // Handle Zod validation errors (array of error objects)
                        errorData.error.forEach(error => {
                            // Format the path array to a readable string
                            const fieldName = Array.isArray(error.path) ? error.path.join('.') : error.path;
                            const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                            
                            toast.error(`${capitalizedField}: ${error.message}`);
                        });
                        
                    } else if (typeof errorData.error === 'string') {
                        // Handle single error message (like "Username is already taken")
                        toast.error(errorData.error);
                    } else {
                        toast.error("Validation failed. Please check your input.");
                    }
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } else if (error.request) {
                // Network error or no response from server
                toast.error("Network error. Please check your connection.");
            } else {
                // Other errors
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isSigningIn:false});
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");

            if(res.data.success === true){
                // Clear the user from the store
                set({authUser: null});
                toast.success(res.data.message || "Logged out successfully");
                get().disconnectSocket();
                return true; // Return true for successful logout
            }
            return false; // Return false if logout was not successful
        } catch (error) {
            console.error(`error in logging out ${error}`);
            toast.error(`Error logging out: ${error.message}`);
            return false; // Return false for failed logout
        }
    },

    connectSocket: async () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            },
        });
        socket.connect();
        set({socket:socket});
        
        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers:userIds});
        });
    },

    disconnectSocket: async () => {
        if(get().socket?.connected) get().socket.disconnect();
    },

    testAccountSignIn: async () => {
        try {
            const res = await axiosInstance.get("/auth/testaccount");
            toast.success("Signed In successfully")
            set({authUser:res.data.user})
            get().connectSocket();    
        } catch (error) {
            console.error(`error signing in ${error.message}`);
            toast.error("Signin Error")
        }
    },


    updateProfile: async (file) => {
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",file);
            if(res.success){
                toast.success("Image Updated succefully");
                set({authUser:res.data.updatedUser})
            }
        } catch (error) {
            console.log(`error in updating profile: ${error.message}`);
            toast.error(error.response.data.message);
        } finally{
            set({isUpdatingProfile:false});
        }
    }



}))