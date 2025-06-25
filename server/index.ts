import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	console.log(`A user connected: ID ${socket.id}`);

	socket.on("join", (room: string) => {
		if (!room || typeof room !== "string") {
			console.error("Room name is required, as a string!");
			return;
		}
		socket.join(room);
		socket.to(room).emit("message", `A user has joined the room: ${room}`);
		console.log(`User joined room: ${room}`);
	});

	socket.on("message", (data: { room: string; message: string }) => {
		const { room, message } = data;
		if (!room || typeof room !== "string") {
			console.error("Room name is required, as a string!");
			return;
		}
		if (!message || typeof message !== "string") {
			console.error("Message is required, as a string!");
			return;
		}
		console.log(`Message received in room ${room}: ${message}`);
		io.to(room).emit("message", message);
	});

	socket.on("leave", (room: string) => {
		if (room && typeof room === "string") {
			socket.leave(room);
			socket.to(room).emit("message", `A user has left the room: ${room}`);
			console.log(`User left room: ${room}`);
		}
	});

	socket.on("disconnect", () => {
		console.log(`A user id ${socket.id} disconnected`);
	});
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
