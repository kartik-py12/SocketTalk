import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                "https://sockettalk.vercel.app"
            ];
            
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                console.log(`Socket.IO CORS blocked origin: ${origin}`);
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    },
});


export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

// for storing online users
const userSocketMap = {}  //{userId:socketId}

io.on("connection",(socket) => {
    console.log(`A user connected ${socket.id}`);

    const userId=socket.handshake.query.userId;

    if(userId) userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`A user disconnected ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});


export {io,app,server};


