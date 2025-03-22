FROM node:18
WORKDIR /usr/src/app
RUN npm init -y 
RUN npm install express
RUN npm install ejs
RUN npm install express-session
RUN npm install mysql2
RUN npm install redis
RUN npm install connect-redis
RUN npm install moment
COPY . .
EXPOSE 8086
CMD ["node", "server.js"]