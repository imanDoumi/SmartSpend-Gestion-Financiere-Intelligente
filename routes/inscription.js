const express = require("express");
router = express.Router();
router.get("/inscription",(req,res)=>{
    res.render("inscription");
})
module.exports=router;