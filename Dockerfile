FROM node:18-alpine

WORKDIR /app

COPY . /app

ENV NODE_ENV=production

RUN npm install serve -g

RUN npm install

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "serve"]