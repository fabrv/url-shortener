FROM node:8.12.0-alpine as builder
WORKDIR /build
COPY package.json tsconfig.json package-lock.json ./
RUN mkdir -p dist && npm install

COPY src/ ./src/
RUN npm run build

FROM node:8.12.0-alpine as prod
WORKDIR /prod
COPY --from=builder build/dist build/package.json build/package-lock.json ./
RUN npm install --production
CMD ["node", "index.js"]