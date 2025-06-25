import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {} });

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("join", (room) => {
		socket.join(room);
		console.log(`User joined room: ${room}`);
	});

	socket.on("message", (data) => {
		const { room, message } = data;
		console.log(`Message received in room ${room}: ${message}`);
		io.to(room).emit("message", message);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

app.use(cors.default());

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
