const express = require("express");
router = express.Router();
router.get("/contact",(req,res)=>{
    res.render("contact");
})
module.exports=router;