# STEP 1 build static website
FROM node:13-alpine as builder
RUN apk update && apk add --no-cache git

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json  /app/
RUN cd /app && npm set progress=false && npm install

# Copy project files into the docker image
COPY .  /app
RUN cd /app && npm run build:prod

# STEP 2 build a small nginx image with static website
FROM nginx:1.15-alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' copy website to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
