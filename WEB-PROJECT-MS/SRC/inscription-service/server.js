const express = require("express");
const path = require("path");
const app = express();
const backsignin = require("./routes/inscription-back");
const inscription = require("./routes/inscription");
app.set("views","./views");
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(inscription);
app.use(backsignin);
app.listen(8082, ()=>{
    console.log("Serveur en écoute ...");
})