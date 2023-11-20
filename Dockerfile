FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev"]
