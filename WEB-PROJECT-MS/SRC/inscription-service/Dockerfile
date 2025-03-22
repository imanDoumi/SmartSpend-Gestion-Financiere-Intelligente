FROM node:18
WORKDIR /usr/src/app
RUN npm init -y 
RUN npm install express
RUN npm install ejs
RUN npm install mysql2
COPY . .
EXPOSE 8082
CMD ["node", "server.js"]