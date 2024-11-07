const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const app = express();

app.use(cors({
    origin: "https://chat-client-sable.vercel.app", // Allow requests from the client domain
    methods: ["GET", "POST"]
}));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "https://chat-client-sable.vercel.app", // Allow only the client URL
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

// Root route
app.get("/", (req, res) => {
    res.send("Hello");
});

// Socket.io connection
io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
