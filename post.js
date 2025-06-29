const express = require("express");

const router = express.Router();

//POST routes

//Index - post
router.get("/", (req, res) => {
    res.send("INDEX ROOT FOR POST");
});

//Show Route - post
router.get("/:id", (req, res) => {
    res.send("SHOW ROUTE POST !!");
});

//Post Route -post
router.post("/", (req, res) => {
    res.send("POST for POST!!");
});

//Delete Route -post
router.delete("/:id", (req, res) => {
    res.send("DELETE for POST!!");
});


module.exports= router;