FROM node:18
WORKDIR /usr/src/app
RUN npm init -y 
RUN npm install express
RUN npm install ejs
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
