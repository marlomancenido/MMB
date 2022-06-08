const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: {type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true},
    friends:[{type: String}]
});

UserSchema.index({firstname: 'text', lastname: 'text'});

UserSchema.pre("save", function(next){
    const user = this;
    
    if(!user.isModified("password")) return next();

    return bcrypt.genSalt((saltError, salt)=>{
        if(saltError) {return next(saltError);}

        return bcrypt.hash(user.password, salt, (hashError, hash)=>{
            if(hashError) { return next(hashError);}

            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, callback){
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);