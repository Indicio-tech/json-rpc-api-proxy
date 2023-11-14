import { JSONRPCServerAndClient } from 'json-rpc-2.0';
import { Transport } from './server';
/**
 * The `JsonRpcApiProxy` class provides a mechanism to set up a JSON-RPC server and client
 * that can communicate over a provided transport layer. It facilitates the creation of a
 * transport-based RPC (Remote Procedure Call) interface, enabling the calling of functions
 * on a remote server accessible through the transport.
 *
 * To use this class, you need to provide a `Transport` object that handles the actual data
 * sending and receiving. The `Transport` must implement two main functions: `send` for sending
 * data to the transport and `ondata` for handling incoming data. It should also handle `onclose`
 * events when the transport is closed.
 *
 * The class creates an RPC server and client, binds them together, and sets up middleware for
 * logging and exception handling. It also defines clean-up logic for server shutdown on receiving
 * a SIGINT signal (commonly issued by pressing Ctrl+C).
 *
 * The `start` method is used to initiate the transport, while the `stop` method can be called
 * to stop the transport and cleanup resources.
 *
 * Example usage:
 * ```
 * const transport = new SomeTransport();
 * const jsonRpcApiProxy = new JsonRpcApiProxy(transport);
 *
 * // Add a method to the RPC interface.
 * jsonRpcApiProxy.rpc.addMethod('methodName', async (params) => {
 *   // Implementation of the method.
 * });
 *
 * // Start the transport to begin listening for RPC calls.
 * jsonRpcApiProxy.start();
 *
 * // Optionally, stop the transport when you are done.
 * // This returns a promise that resolves once the transport has been stopped.
 * jsonRpcApiProxy.stop().then(() => {
 *   console.log('Transport stopped');
 * });
 * ```
 * Note that error handling and cleanup logic should be implemented within the transport's
 * `ondata` and `onclose` handlers, as well as in the SIGINT signal handler to ensure graceful
 * shutdowns.
 * @class
 * @property {Transport} transport - The transport layer object used for sending and receiving messages.
 * @property {JSONRPCServerAndClient} rpc - The JSON-RPC server and client instance for managing RPC calls.
 */
export declare class JsonRpcApiProxy {
    /**
     * The transport layer used by the JSON-RPC server and client to send and receive messages.
     * @private
     */
    private transport;
    /**
     * The JSON-RPC server and client instance for managing RPC calls.
     * @public
     */
    rpc: JSONRPCServerAndClient;
    /**
     * Constructs the `JsonRpcApiProxy` with the provided transport layer.
     * Initializes the JSON-RPC server and client, sets up data listeners and
     * middleware, and handles transport close events.
     * @constructor
     * @param {Transport} transport - The transport layer for message passing.
     */
    constructor(transport: Transport);
    /**
     * Starts the JSON-RPC transport, allowing it to send and receive messages.
     * @public
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the JSON-RPC transport and resolves once the transport layer has been successfully stopped.
     * @public
     * @returns {Promise<void>} - A promise that resolves when the transport is stopped.
     */
    stop(): Promise<void>;
}
