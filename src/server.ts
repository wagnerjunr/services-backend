import { app } from "./app.js";
import { Server } from 'socket.io';
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer,{cors:{origin:"*"}});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (message) => {
    console.log("Received message:", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


httpServer.listen(3008, () => {
  console.log("Socket.io server listening on port 3008");
})

app.listen({ port: 1912 }).then(() => {
  console.log("Server Running");
});
