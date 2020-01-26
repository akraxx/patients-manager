# STEP 1 build static website
FROM node:10.11-alpine as builder
RUN apk update && apk add --no-cache git

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json  /app/
RUN cd /app && npm set progress=false && npm install

# Copy project files into the docker image
COPY .  /app
RUN cd /app && npm run build

###############################################################################
# Step 2 : Run image
#
FROM node:10.11-alpine
ENV NODE_ENV=production
WORKDIR /app

# Add support for https on wget
RUN apk update && apk add --no-cache wget && apk --no-cache add openssl wget && apk add ca-certificates && update-ca-certificates

# Add phantomjs
RUN wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm config set user 0 \
    && npm install -g phantomjs-prebuilt

# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family && rm -rf /var/cache/apk/*

# Copy builded source from the upper builder stage
COPY --from=builder /app /app

RUN ls -lrth /app

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 4000

# Start the app
CMD npm start