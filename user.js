const express = require("express");
const router= express.Router();


//Index - users
router.get("/", (req, res) => {
    res.send("INDEX ROOT FOR USERS");
});

//Show Route - users
router.get("/:id", (req, res) => {
    res.send("SHOW ROUTE for USERS !!");
});

//Post Route -users
router.post("/", (req, res) => {
    res.send("POST for users!!");
});

//Delete Route -users
router.delete("/:id", (req, res) => {
    res.send("DELETE for users!!");
});

module.exports= router;