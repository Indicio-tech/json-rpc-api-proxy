/// <reference types="node" />
/// <reference types="node" />
import { Server, Socket } from 'net';
/**
 * A handler function that processes string data.
 * @callback Handler
 * @param {string} data - The data string to process.
 * @returns {Promise<void>} A promise that resolves when the processing is complete.
 */
type Handler = (data: string) => Promise<void>;
/**
 * Defines the interface for transport layer implementations.
 * @interface
 */
export interface Transport {
    start(): void;
    stop(): Promise<void>;
    ondata(handler: Handler): void;
    onclose(handler: () => void): void;
    send(data: string): void;
}
/**
 * Buffers incoming data and processes it to extract messages based on a header format.
 * @class
 */
export declare class MessageBuffer {
    private buffer;
    private headerSize;
    /**
     * Callback for when a complete message is available.
     * @public
     */
    onMessage?: (message: string) => void;
    /**
     * Appends incoming data to the buffer and processes it.
     * @param {Buffer} data - The incoming data buffer.
     * @public
     */
    append(data: Buffer): void;
    /**
     * Processes the buffer to extract messages.
     * @private
     */
    private processBuffer;
}
/**
 * An abstract base class for socket server transports that implement the Transport interface.
 * @class
 * @abstract
 */
export declare abstract class BaseSocketServer implements Transport {
    protected server: Server;
    protected handlers: Handler[];
    protected closeHandlers: (() => void)[];
    protected sockets: Set<Socket>;
    constructor();
    /**
     * Abstract method to start the server. Must be implemented by subclasses.
     * @abstract
     */
    abstract start(): void;
    /**
     * Stops the server and all associated connections.
     * @returns {Promise<void>} A promise that resolves when the server is stopped.
     * @public
     */
    stop(): Promise<void>;
    /**
     * Registers a data handler.
     * @param {Handler} handler - The handler function to register.
     * @public
     */
    ondata(handler: Handler): void;
    /**
     * Registers a close handler.
     * @param {() => void} handler - The handler function to call when the server closes.
     * @public
     */
    onclose(handler: () => void): void;
    /**
     * Sends data to all connected sockets.
     * @param {string} data - The data string to send.
     * @public
     */
    send(data: string): void;
}
/**
 * Configuration for creating a Unix socket server.
 * @property {string} socketPath - The file system path to the Unix socket.
 */
export interface UnixServerConfig {
    socketPath: string;
}
/**
 * Server implementation for Unix socket transport.
 * @class
 * @extends BaseSocketServer
 */
export declare class UnixSocketServer extends BaseSocketServer {
    private config;
    constructor(config: UnixServerConfig);
    start(): void;
}
/**
 * Configuration for creating a TCP server.
 * @property {string} host - The hostname or IP address.
 * @property {number} port - The port number.
 */
export interface TCPServerConfig {
    host: string;
    port: number;
}
/**
 * Server implementation for TCP socket transport.
 * @class
 * @extends BaseSocketServer
 */
export declare class TCPSocketServer extends BaseSocketServer {
    private config;
    constructor(config: TCPServerConfig);
    start(): void;
}
export {};
