FROM python:3.9-slim-bookworm
WORKDIR /usr/src/app
COPY clients/python/ ./jrpc_client/
RUN pip install ./jrpc_client

COPY int/client/client.py ./client.py
CMD ["python", "client.py"]
