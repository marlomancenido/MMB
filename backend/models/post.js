const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    body: {type: String},
    userid: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required:true}
});

module.exports = mongoose.model("Post", PostSchema);