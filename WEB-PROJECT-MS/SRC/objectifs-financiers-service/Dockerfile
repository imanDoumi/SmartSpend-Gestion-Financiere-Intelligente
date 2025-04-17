FROM node:18
WORKDIR /usr/src/app
RUN npm init -y 
RUN npm install express
RUN npm install ejs
RUN npm install express-session
RUN npm install mysql2
RUN npm install redis
RUN npm install connect-redis
COPY . .
EXPOSE 8087
CMD ["node", "server.js"]