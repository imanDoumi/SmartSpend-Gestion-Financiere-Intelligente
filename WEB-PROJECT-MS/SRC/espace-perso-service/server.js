const express = require("express");
const path = require("path");
const app = express();
const espace_perso = require("./routes/espace-perso");
const espace_perso_back = require("./routes/espace-perso-back");
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
app.use(espace_perso);
app.use(espace_perso_back);
app.listen(8083, ()=>{
    console.log("Serveur en écoute ...");
})