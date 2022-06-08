const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    relation: {type: Number, enums:[0,1], default:0}
});

module.exports = mongoose.model("Friend", FriendSchema);