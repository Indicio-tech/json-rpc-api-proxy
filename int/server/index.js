const { JsonRpcApiProxy, TCPSocketServer } = require('json-rpc-api-proxy');

const transport = new TCPSocketServer({
  host: '0.0.0.0',
  port: 3000,
});
const jsonRpcApiProxy = new JsonRpcApiProxy(transport);

// Add method handler for 'add'
jsonRpcApiProxy.rpc.addMethod('add', async (params) => {
  const [ a, b ] = params;
  return a + b;
});

// Add method handler for 'subtract'
jsonRpcApiProxy.rpc.addMethod('subtract', async (params) => {
  const [ a, b ] = params;
  return a - b;
});

// Add notification handler for 'notify'
jsonRpcApiProxy.rpc.addMethod('notify', (params) => {
  // Logic to handle notification
  console.log('Notification received:', params);

  // Send a notification back to the client
  jsonRpcApiProxy.rpc.notify('notification_received', { 
    originalMessage: params,
    response: 'Notification processed' 
  });
});

// Start the server
jsonRpcApiProxy.start();
