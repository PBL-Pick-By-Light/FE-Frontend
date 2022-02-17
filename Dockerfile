# Download and use the official node image vers. 16.13.0 in the build layer
FROM node:16.13.0 as build-stage
# Set the working directory for following file instructions (RUN, CMD, ENTRYPOINT, COPY, ADD)
WORKDIR /app
# Copy all package*.json Files to the working directory
COPY package*.json ./
# Run npm install in the container shell
RUN npm install --loglevel=error
COPY ./ .
# Run the npm build process in the container shell
RUN npm run build --loglevel=error

# Download and use nginx in the production layer
FROM nginx as production-stage
# Create app directory
RUN mkdir /app
# Copy the builded app from the build layer to the production layer
COPY --from=build-stage /app/dist /app
# Copy the nginx configuration file in the container
COPY config/nginx.conf /etc/nginx/nginx.conf
