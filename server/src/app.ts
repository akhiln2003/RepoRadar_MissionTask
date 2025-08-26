import { Iserver } from "./domain/interfaces/Iserver";
import {
  connectDB,
  disconnectDB,
} from "./infrastructure/database/mongodb/connection";
import { errorHandler } from "./infrastructure/middlewares/errorMiddleware";
import { Routers } from "./presentation/routes/routes";

export class App {
  constructor(private _server: Iserver) {}

  async initialize(): Promise<void> {
    await this._connectDB();
    this._registerMiddleware();
    this._registerRoutes();
    this._registerErrorHandler();
  }

  private _registerMiddleware(): void {
    // register global middleware if needed
  }

  private _registerRoutes(): void {
    const routes = new Routers().getRouter();
    this._server.registerRoutes("/api", routes);
  }

  private _registerErrorHandler(): void {
   this._server.registerErrorHandler(errorHandler);
  }

  async start(port: number): Promise<void> {
    await this._server.start(port);
  }

  async shutdown(): Promise<void> {
    await disconnectDB();
    console.log("Server shut down gracefully");
  }

  private async _connectDB(): Promise<void> {
    try {
      await connectDB();
    } catch (error: any) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }
}
