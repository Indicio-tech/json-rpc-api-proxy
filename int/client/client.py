import asyncio
from os import getenv

from jrpc_client import JsonRpcClient, TCPSocketTransport

SERVER_HOST = getenv("SERVER_HOST", "localhost")
SERVER_PORT = int(getenv("SERVER_PORT", "3000"))

async def test_json_rpc_methods():
    transport = TCPSocketTransport(SERVER_HOST, SERVER_PORT)
    async with transport, JsonRpcClient(transport) as client:
        # Test 'add' method
        add_result = await client.request('add', 5, 3)
        print(f"Result of add: {add_result}")

        # Test 'subtract' method
        subtract_result = await client.request('subtract', 10, 4)
        print(f"Result of subtract: {subtract_result}")

        # Test 'notify' method and await notification
        await client.notify('notify', message='Hello Server')
        notification_response = await client.notification_received('notification_received')
        print(f"Notification response: {notification_response}")

if __name__ == "__main__":
    asyncio.run(test_json_rpc_methods())
