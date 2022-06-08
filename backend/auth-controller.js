const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const Friend = mongoose.model("Friend");


exports.signUp = (req, res)=>{
    const newuser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        friends: []
    });

    // Save new user to users table
    newuser.save((err)=>{
        if(err) { 
          // Server encountered an error
          return res.send({success: false})
        } else { 
          // User is saved
          return res.send({success: true})
        }
    });
}

exports.login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;
  
    User.findOne({ email }, (err, user) => {
      // Check if email exists
      if (err || !user) {
        //  User doesn't exist
        console.log("user doesn't exist");
        return res.send({ success: false });
      }
  
      // Check if password is correct
      user.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
          // Wrong password
          console.log("wrong password");
          return res.send({ success: false });
        }
    
        // Create token
        const tokenPayload = {
          _id: user._id
        }
        
        // Sign token
        const token = jwt.sign(tokenPayload, "EPLURIBUSANUS_6SM");
  
        // Return the token
        return res.send({ success: true, token, firstname: user.firstname, userid: user._id, lastname: user.lastname});
      })
    })
  }

  exports.checkIfLoggedIn = (req, res) => {

    if (!req.cookies || !req.cookies.authToken) {
      // No cookies / no authToken cookie sent
      return res.send({ isLoggedIn: false });
    }
  
    // Token is present. Validate it
    return jwt.verify(
      req.cookies.authToken,"EPLURIBUSANUS_6SM",(err, tokenPayload) => {
        if (err) {
          // Invalid token
          return res.send({ isLoggedIn: false });
        }
  
        const userId = tokenPayload._id;

        return User.findById(userId, (userErr, user) => {
          if (userErr || !user) {
            // user is not found
            return res.send({ isLoggedIn: false });
          }
  
          // no errors, user is logged in
          return res.send({ isLoggedIn: true });
        });
      });
  }

exports.confirmFriend = (req, res)=>{

    // Adds each other's ids to each other's friends array making them friends
    User.updateOne({_id: req.body.sender}, {$push: {'friends':req.body.receiver}},(err)=>{
      if(!err){
        User.updateOne({_id: req.body.receiver}, {$push: {'friends':req.body.sender}}, (err)=>{
          if(!err){
            return res.send({success: true})
          } else{
            // Second user might not have been found or encountered an error
            return res.send({success: false})
          }
        })
      } else{
        // User might not have been found or encountered an error
        return res.send({success: false})
      }
    })
}

exports.getFriends = (req, res) => {
  // Finds user in table
  User.findOne({_id: req.body.userid}, (err, user)=>{
    // Returns user's friends array
    if(!err){
      return res.send({success: true, userfriends: user.friends})
    } 
    // User doesn't exist
    else{
      return res.send({success: false})
    }
  })
}

exports.getUser = (req, res) => {
  // Returns user's info (name, email)
  User.findOne({_id: req.body.id}, (err, user)=>{
    if(!user || err){
      // Encountered an error or user wasn't found
      return res.send({success: false})
    } else{
        return res.send({success: true, name: user.firstname+" "+user.lastname, email: user.email})
    }
  })
}

exports.deleteFriend = (req, res)=>{
  // Pulls each other's ids from each other's friends array
  User.updateOne({_id: req.body.sender}, {$pull: {'friends':req.body.receiver}},(err)=>{
    if(!err){
      User.updateOne({_id: req.body.receiver}, {$pull: {'friends':req.body.sender}}, (err)=>{
        if(!err){
          return res.send({success: true})
        } else{
          // User wasn't found or another error was encountered
          return res.send({success: false})
        }
      })
    } else{
      // User wasn't found or another error was encountered
      return res.send({success: false})
    }
  })
}

exports.getUserName = (req, res)=>{
  // Returns the concatenated firstname and lastname of a user
  User.findOne({_id: req.body.id}, (err, user)=>{
    if(!err){
      return res.send({name: user.firstname+" "+user.lastname})
    }
  })
}

exports.searchUsers = (req, res)=>{
  // Searches the users table for the sent keywords. Takes advantage of the text indexed fields in schema
  User.find({$text: {$search: req.body.keywords}}, (err,users)=>{
    if(!err){
      // Found some people
      return res.send({success: true, results: users})
    } else{
      // User wasn't found
      return res.send({success: false})
    }
  })
}