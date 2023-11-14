"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPSocketServer = exports.UnixSocketServer = exports.BaseSocketServer = exports.MessageBuffer = void 0;
const net_1 = require("net");
/**
 * Buffers incoming data and processes it to extract messages based on a header format.
 * @class
 */
class MessageBuffer {
    constructor() {
        this.buffer = Buffer.alloc(0);
        this.headerSize = null;
        /**
         * Callback for when a complete message is available.
         * @public
         */
        this.onMessage = undefined;
    }
    /**
     * Appends incoming data to the buffer and processes it.
     * @param {Buffer} data - The incoming data buffer.
     * @public
     */
    append(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
        this.processBuffer();
    }
    /**
     * Processes the buffer to extract messages.
     * @private
     */
    processBuffer() {
        while (true) {
            if (this.headerSize === null) {
                const headerEnd = this.buffer.indexOf('\n');
                if (headerEnd !== -1) {
                    const header = this.buffer.subarray(0, headerEnd).toString();
                    const match = header.match(/^length: (\d+)/);
                    if (match) {
                        this.headerSize = Number(match[1]);
                        this.buffer = this.buffer.subarray(headerEnd + 1); // +1 for the new line
                    }
                    else {
                        throw new Error('Invalid message header');
                    }
                }
                else {
                    // Not enough data to read the header yet
                    break;
                }
            }
            // If we have determined the headerSize, see if we have enough buffer to read it
            if (this.headerSize !== null && this.buffer.length >= this.headerSize) {
                const message = this.buffer.subarray(0, this.headerSize).toString();
                this.buffer = this.buffer.subarray(this.headerSize);
                this.headerSize = null; // Reset for the next message
                // Emit the 'message' event with the complete message
                if (!this.onMessage) {
                    throw new Error('No message handler set');
                }
                this.onMessage(message);
            }
            else {
                // Not enough data to read the full message yet
                break;
            }
        }
    }
}
exports.MessageBuffer = MessageBuffer;
/**
 * An abstract base class for socket server transports that implement the Transport interface.
 * @class
 * @abstract
 */
class BaseSocketServer {
    constructor() {
        this.handlers = [];
        this.closeHandlers = [];
        this.sockets = new Set();
        this.server = (0, net_1.createServer)(socket => {
            const messageBuffer = new MessageBuffer();
            messageBuffer.onMessage = message => {
                for (const handler of this.handlers) {
                    handler(message).then();
                }
            };
            socket.on('data', data => {
                messageBuffer.append(data);
            });
            socket.on('close', () => {
                this.sockets.delete(socket);
                for (const handler of this.closeHandlers) {
                    handler();
                }
            });
            socket.on('error', err => {
                console.error('Socket error:', err);
            });
            this.sockets.add(socket);
        });
    }
    /**
     * Stops the server and all associated connections.
     * @returns {Promise<void>} A promise that resolves when the server is stopped.
     * @public
     */
    stop() {
        this.server.close(() => {
            console.log('Closed out remaining connections.');
            return Promise.resolve();
        });
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
        }, 10000);
        return Promise.reject('Server did not stop in time');
    }
    /**
     * Registers a data handler.
     * @param {Handler} handler - The handler function to register.
     * @public
     */
    ondata(handler) {
        this.handlers.push(handler);
    }
    /**
     * Registers a close handler.
     * @param {() => void} handler - The handler function to call when the server closes.
     * @public
     */
    onclose(handler) {
        this.closeHandlers.push(handler);
    }
    /**
     * Sends data to all connected sockets.
     * @param {string} data - The data string to send.
     * @public
     */
    send(data) {
        const buffer = Buffer.from(data);
        const header = `length: ${buffer.length}\n`;
        const headerBuffer = Buffer.from(header);
        const message = Buffer.concat([headerBuffer, buffer]);
        for (const socket of this.sockets) {
            socket.write(message);
        }
    }
}
exports.BaseSocketServer = BaseSocketServer;
/**
 * Server implementation for Unix socket transport.
 * @class
 * @extends BaseSocketServer
 */
class UnixSocketServer extends BaseSocketServer {
    constructor(config) {
        super();
        this.config = config;
    }
    start() {
        this.server.listen(this.config.socketPath, () => {
            console.log(`Server listening on Unix socket ${this.config.socketPath}`);
        });
    }
}
exports.UnixSocketServer = UnixSocketServer;
/**
 * Server implementation for TCP socket transport.
 * @class
 * @extends BaseSocketServer
 */
class TCPSocketServer extends BaseSocketServer {
    constructor(config) {
        super();
        this.config = config;
    }
    start() {
        this.server.listen(this.config.port, this.config.host, () => {
            console.log(`Server listening on TCP ${this.config.host}:${this.config.port}`);
        });
    }
}
exports.TCPSocketServer = TCPSocketServer;
