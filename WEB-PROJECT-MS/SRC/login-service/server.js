const express = require("express");
const path = require("path");
const app = express();
const login = require("./routes/login");
const backsignup = require("./routes/login-back");
const { RedisStore } = require("connect-redis");
const session = require("express-session");
const { createClient } = require("redis");

// Initialize client.
const redisClient = createClient({
    url: "redis://redis:6379"
  });
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient
  });
app.use(
    session({
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "rsspsagi",
    })
  );

app.set("views","./views");
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(login);
app.use(backsignup);
app.listen(8081, ()=>{
    console.log("Serveur en écoute ...");
})