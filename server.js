const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=>res.send("API is running"))

app.listen(5000, ()=>{
    console.log(`Server is started at port ${PORT}`)
});