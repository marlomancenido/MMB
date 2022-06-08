const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// connect to mongo db
mongoose.connect(
    "mongodb://localhost:27017/MMB",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    (err)=>{
        if (err) { console.log(err);}
        else { console.log("Successfully connected to Mongo DB");}
    }
);

require("./models/user");
require("./models/post");
require("./models/friend")


const app = express();
app.use(express.urlencoded({ extended: true}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, Accept, Content-Type")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

require("./routes")(app);

app.listen(3001, (err)=>{
    if(err){ console.log(err);}
    else { console.log("Server listening at port 3001");}
})
