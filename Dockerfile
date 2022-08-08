FROM node:18.7.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3030
CMD [ "node", "app.js" ]
