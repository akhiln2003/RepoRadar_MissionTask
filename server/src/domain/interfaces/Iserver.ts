export interface Iserver{
    start(port: number): Promise<void>;
    close(): Promise<void>;
    registerMiddleware(middleware: any): void;
    registerRoutes(path: string, router: unknown): void;
    registerErrorHandler(middleware: unknown): void;
}