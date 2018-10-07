FROM node:8.12.0-alpine as builder
WORKDIR /build
COPY package.json tsconfig.json package-lock.json ionic.config.json ./
RUN npm install

COPY src/ ./src/
RUN ionic build
CMD ["ionic", "serve"]