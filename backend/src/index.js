import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";

import {app,server} from "./lib/socket.js"

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", PORT);



app.use(cookieParser());
// Increase JSON body size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? ["https://sockettalk.vercel.app", "https://your-vercel-domain.vercel.app"] 
        : "http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV === "production"){
    const frontendDistPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendDistPath)); 

    app.get("*",(req,res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

server.listen(PORT,()=>{
    connectDB();
    console.log(`listing at port ${PORT}`);
})