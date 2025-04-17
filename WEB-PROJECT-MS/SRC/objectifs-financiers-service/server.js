const express = require("express");
const path = require("path");
const app = express();
const objectifs_financiers = require("./routes/objectifs-financiers");
const objectifs_financiers_back = require("./routes/objectifs-financiers-back");
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
app.use(objectifs_financiers);
app.use(objectifs_financiers_back);
app.listen(8087, ()=>{
    console.log("Serveur en écoute ...");
})