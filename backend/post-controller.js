const mongoose = require("mongoose");
 
const Post = mongoose.model("Post");

exports.makePost = (req, res)=>{

    // Make a post in posts table
    const newpost = new Post({
        body: req.body.text,
        userid: req.body.userid,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    // Saves post to the table
    newpost.save((err)=>{
        if(err) { 
            return res.send({success: false})
        }
        else { 
            return res.send({success: true})
        }
    });
};

exports.getPosts = (req,res, next)=>{
    // Gets a user's posts (given their id, return all their posts )
    Post.find({"userid":req.body.userid}, (err, post)=>{
        if(!err && post){ 
            return res.send({success: true, results: post})
        } else{
            return res.send({success: false})
        }
    })
    
}

exports.deletePost=(req,res)=>{
    // Delete a specific post (given its id)
    Post.findOneAndDelete({_id: req.body.id}, (err,post) => {
        if(!err && post){
            res.send({success: true})
        } else{
            res.send({success: false})
        }
    })
}

exports.editPost=(req,res)=>{
    // Edit a post (given its id and the new text for replacement)
    Post.updateOne({_id: req.body._id}, {'body': req.body.newtext}, (err) => {
        if(!err){
            return res.send({success: true})
        } else{
            return res.send({success: false})
        }
    })
}