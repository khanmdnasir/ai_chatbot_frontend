FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY . /app

RUN npm install serve -g

RUN npm install

RUN npm run build
