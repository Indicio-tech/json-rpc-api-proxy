# JSON-RPC API Proxy Library

This library provides a flexible and easy-to-use implementation for setting up JSON-RPC servers with notifications. It features `JsonRpcApiProxy`, a class that facilitates creating JSON-RPC interfaces over various transport layers. The library includes built-in support for TCP and Unix socket transport with `TCPSocketServer` and `UnixSocketServer`, respectively.

## Features

- **JSON-RPC Server and Client**: Implement JSON-RPC 2.0 protocol for both server and client. This enables responding to requests as well as sending asynchronous notifications.
- **Custom Transport Layer**: Use different transport layers for communication.
- **Middleware Support**: Add custom middleware (logging and exception handling enabled by default).
- **Basic Transports Included**: Built-in `TCPSocketServer` and `UnixSocketServer`.
- **Extensibility**: Easily extendable for other transport layers like WebSocket, HTTP, etc.

## Installation

You can install the library using npm:

```bash
npm install json-rpc-api-proxy
```

## Usage

### Creating a JSON-RPC Server and Client with TCP Transport

Below is a basic example of using `JsonRpcApiProxy` with a TCP socket server.

```typescript
import { JsonRpcApiProxy, TCPSocketServer } from 'json-rpc-api-proxy';

// Configure the TCP server
const serverConfig = {
  host: 'localhost',
  port: 3000,
};

// Create a TCP socket server
const tcpSocketServer = new TCPSocketServer(serverConfig);

// Create an instance of JsonRpcApiProxy with the TCP server
const jsonRpcApiProxy = new JsonRpcApiProxy(tcpSocketServer);

// Add a method to the RPC interface
jsonRpcApiProxy.rpc.addMethod('getGreeting', async params => {
  return `Hello, ${params.name || 'World'}!`;
});

// Start the server
jsonRpcApiProxy.start();

// ...
// Asynchronously send notifications
jsonRpcApiProxy.rpc.client.notify('someEvent', { message: 'Notification!' });
```

## Documentation

For detailed documentation, refer to the JSDocs on the classes provided in the repository.

## Contributing

Contributions are welcome! Please read our contributing guidelines in `CONTRIBUTING.md` before submitting pull requests.

## License

This library is licensed under the [Apache 2.0 License](LICENSE).

## Support

If you have any issues or feature requests, please open an issue in the GitHub repository.
