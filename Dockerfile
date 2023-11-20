FROM node:16-alpine
RUN apk update && apk add git
WORKDIR /app
COPY package.json /app/package.json
COPY . .
RUN npm install
RUN npm run build