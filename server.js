import express from "express";
import authrouter from "./authrouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import model from "./model.js";

const { userMesg } = model;


dotenv.config();

const app = express();
// const port = 3000;

const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://react-chat-app-blond.vercel.app/"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
})

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());




app.get("/", (req, res) => {
    res.send("Hello Server");
});

app.use("/auth", authrouter);

io.on("connection", (Socket) => {
    console.log(`sockit io connected, ${Socket.id}`);

    Socket.on("Old Messages", async () => {
        try {
            const oldmesg = await userMesg.find().sort({ createdAt: 1 })
            Socket.emit("Old Messages", oldmesg)
        }
        catch (error) {
            console.log(error.message)
        }
    })

    Socket.on("Mesg send", async (data) => {
        console.log(data);

        try {
            const Messages = new userMesg({
                auther: data.auther,
                message: data.message,
                time: data.time
            })

            const savedmesg = await Messages.save()
            io.emit("New Mesg", savedmesg)

        }
        catch (error) {
            console.log("Error occur", error.message);
        }


    });

    Socket.on("disconnect", () => {
        console.log(`user disconnected, ${Socket.id}`);
    })
});



mongoose.connect(process.env.MONGODB).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log(error.message);
})


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


export default app;
