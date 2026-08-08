FROM node:22 as build

WORKDIR /app

COPY package*.json ./

# Set NODE_OPTIONS for the build process
ARG GENERATE_SOURCEMAP=false
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm install

COPY . .

ARG BUILD_ENV

RUN npm run build:${BUILD_ENV}

# Use NGINX to serve the application in production
FROM nginx:stable-alpine

# Copy the built app from the build image
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Add a custom main config that controls worker count
COPY nginx-main.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# The default command starts NGINX
CMD ["nginx", "-g", "daemon off;"]
