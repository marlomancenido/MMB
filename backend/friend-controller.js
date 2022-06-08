const mongoose = require("mongoose");
 
const Friend = mongoose.model("Friend");
const User = mongoose.model("User");

exports.sendRequest = (req, res)=>{
    // New friend request
    const newRequest = new Friend({
        sender: req.body.sender,
        receiver: req.body.receiver
    });

    // Save friend request to the friend table
    newRequest.save((err)=>{
        if(err) { 
            return res.send({success: false})
        } else { 
            return res.send({success: true})
        }
    });
};

exports.deleteRequest = (req, res)=>{
    // Delete a friend request from the friend table
    Friend.deleteOne({'sender': req.body.sender, 'receiver': req.body.receiver}, (err,count) => {
        if(!err && count){
            res.send({success: true})
        } else{
            res.send({success: false})
        }
    })
}

exports.getRequestStatus = (req, res)=>{
    // Checks if there is a pending request between users
    Friend.find({'sender': req.body.sender, 'receiver': req.body.receiver}, (err,flag)=>{
        // Status 1: User is sender. Friend request is pending for receiver's action.
        if(flag.length){
            return res.send({success: true, status: 1})
        } else {
            Friend.find({'sender': req.body.receiver, 'receiver': req.body.sender}, (err,flag)=>{
                // Status 2: User is receiver. They must accept/reject the request.
                if(flag.length){
                    return res.send({success: true, status: 2})
                } else{
                    // Status 0: There are no requests
                    return res.send({success: true, status: 0})
                }

            })
        }
    })
}

exports.checkFriendship = (req, res)=>{
    // Check if two users are friends or not
    User.findOne({_id: req.body.loggedUser, friends: req.body.targetUser}, (err, user)=>{
        if(err || !user){
            // Friend not found
            return res.send({success: false})
        }
        
        // Friend Found
        return res.send({success: true})

    })
}

exports.getFriendRequests = (req, res)=>{
    // Gets a user's pending friend requests (pending the user's approval)
    Friend.find({receiver: req.body.userid}, (err, requests)=>{
        if(!err){
            return res.send({requests})
        }
    })
}