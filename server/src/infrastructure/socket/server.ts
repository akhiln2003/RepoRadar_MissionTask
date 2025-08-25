import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export class SocketServer {
  private _io: Server;
  private _online: Map<string, string> = new Map();

  constructor(httpServer: HttpServer) {
    this._io = new Server(httpServer, {
      cors: {
        origin: [process.env.CLIENT_URL as string, "http://localhost:5173"],
        methods: ["GET", "POST"],
      },
    });

    this._setupListeners();
  }

  private _handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id},`);
    this._setupSocketListeners(socket);
  }

  private _handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);
  }

  private _handleDirectNotification(socket: Socket, data: any): void {
    if (!data.receiverId) {
      console.error("Direct message missing receiverId");
      return;
    }
    const { receiverId, notification } = data;
    console.log(receiverId, this._online.get(receiverId));

    if (this._online.has(receiverId)) {
      const socketId = this._online.get(receiverId);

      this._io.to(socketId!).emit("direct_notification", notification);
      console.log(
        `User ${receiverId} is offline, sending notification to socket ID: ${socketId}`
      );
    }
  }

  private _handleJoin(socket: Socket, userId: string): void {
    this._online.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ID: ${socket.id}`);

    console.log("Online users:");
    for (const [userId, socketId] of this._online.entries()) {
      console.log(`- ${userId}: ${socketId}`);
    }
  }

  private _handleMarkAllRead(socket: Socket, data: { userId: string }): void {
    const { userId } = data;

    const receiverSocketId = this._online.get(userId);
    if (receiverSocketId) {
      this._io.to(receiverSocketId).emit("mark_all_read", { userId });
      console.log(`Emitted 'mark_all_read' to socket: ${receiverSocketId}`);
    } else {
      console.log(`User ${userId} not online; cannot emit 'mark_all_read'`);
    }
  }

  private _handileLeave(socket: Socket, userId: string): void {
    socket.leave(userId);
    this._online.delete(userId);
    this._io.emit("leave", userId);
    console.log(`User ${userId} left with socket ID: ${socket.id}`);
  }

  private _setupSocketListeners(socket: Socket): void {
    socket.on("join", ({ userId }: { userId: string }) => {
      console.log(`User ${userId} joined with socket ID: ${socket.id}`);
      return this._handleJoin(socket, userId);
    });
    socket.on("direct_notification", (data) =>
      this._handleDirectNotification(socket, data)
    );
    socket.on("mark_all_read", (data) => this._handleMarkAllRead(socket, data));
    socket.on("leave", (userId: string) => this._handileLeave(socket, userId));
    socket.on("disconnect", () => this._handleDisconnect(socket));
  }
  private _setupListeners(): void {
    this._io.on("connection", (socket: Socket) =>
      this._handleConnection(socket)
    );
  }

  public getIO(): Server {
    return this._io;
  }
}
