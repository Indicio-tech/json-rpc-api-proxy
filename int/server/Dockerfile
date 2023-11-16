# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y ncat && apt-get clean

RUN mkdir json-rpc-api-proxy
COPY dist/ ./json-rpc-api-proxy/
COPY package*.json ./json-rpc-api-proxy/

# Install any needed packages
RUN npm install ./json-rpc-api-proxy

# Bundle your app's source code inside the Docker image
COPY int/server/index.js ./

# If your app binds to a port, use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "index.js" ]
