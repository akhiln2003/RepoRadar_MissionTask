import { Application } from "express";
import { Iserver } from "../../domain/interfaces/Iserver";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";

export class ExpressWebServer implements Iserver {
  private _app: Application;
  private _server: any;

  constructor() {
    this._app = express();
    this._app.use(cookieParser());
    this._app.use(
      cors({
        origin: "http://localhost:5173", // Frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
        credentials: true, // If you're sending cookies or authorization headers
      })
    );
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(express.json());

    this._server = createServer(this._app);
  }
  registerMiddleware(middleware: any): void {
    this._app.use(middleware);
  }
  registerRoutes(path: string, router: any): void {
    this._app.use(path, router);
  }

  registerErrorHandler(middleware: any): void {
    this._app.use(middleware);
  }
  async start(port: number): Promise<void> {
    return new Promise((res) => {
      this._server.listen(port, () => {
        console.log(`App listening on port ===> http://localhost:${port}/`);
        res();
      });
    });
  }

  async close(): Promise<void> {
    if (this._server) {
      return new Promise((resolve, reject) => {
        this._server.close((err: any) => {
          if (err) {
            console.error("Error closing", err);
            return reject(err);
          }
          console.log("Server closed");
          resolve();
        });
      });
    }
  }
}
