const mongoose = require("mongoose");
const _ =require("lodash");

const user = new mongoose.Schema({
    name: {type:String},
    email:{type:String},
    password: {type:String},
    role: {type:String},
    cartData: Array
});

user.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','name','email','password','role']);
}

user.statics.findByEmail = function(email){
    debugger;
    let usr = this;
    return usr.findOne({'email':email}).then((user) => {
        debugger;
        if(user){
            return Promise.reject();
        }
        return new Promise((resolve) => {
            resolve(true);
        });

    })
}

user.statics.findByCredential = function(eml,pswd){
    let usr = this;
    return usr.findOne({'email':eml,'password':pswd}).then((user) => {
        if(user){
            return user;
        }
        return false;
    })
}

user.statics.addUserCart = function(userDataObject){
    let usr = this;
    return usr.findOneAndUpdate({'_id':userDataObject.uid},{'cartData':userDataObject.cartData},{new: true})
        .then((user) => {
            if(user){
                return new Promise((resolve) => {
                    resolve(user);
                });
            }
            return Promise.reject();
        })
}

user.methods.generateAuthToken = function () {
    let user = this;
}

const User = mongoose.model('User',user);
module.exports = {User};
