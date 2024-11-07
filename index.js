const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const app = express(); // Create an express application
const server = http.createServer(app);

const io = socketIo(server, {
    cors: { // Corrected "cros" to "cors"
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// MongoDB connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Database connected successfully"))
.catch((e) => console.error("MongoDB connection error:", e));

// Socket.io connection
io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    
    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message); // Corrected "reveiveMessage" to "receiveMessage"
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});

//"/" route
app.get("/", (req,res)=>{
    res.send("Hello");
})

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
