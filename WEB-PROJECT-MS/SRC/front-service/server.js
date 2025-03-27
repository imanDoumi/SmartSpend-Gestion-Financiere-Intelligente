const express = require("express");
const path = require("path");
const app = express();
const home = require("./routes/home");
const contact = require("./routes/contact");
app.set("views","./views");
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(home);
app.use(contact)
app.listen(8080, ()=>{
    console.log("Serveur en écoute ...");
})