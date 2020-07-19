const mongoose = require("mongoose");
const instructor = mongoose.Schema({
    name:{type:String},
    email:{type:String},
    profession: {type:String},
    selfDescription: {type:String},
    courses: {type:Number},
    password: {type:String},
    role: {type:String},
    own_Img: {type: String,required: false},
});

instructor.statics.findByEmail = function(email){
    let instructors = this;
    return instructors.findOne({'email':email}).then((instructor) => {
        debugger;
        if(instructor){
            console.log("rejected....",instructor);
            return Promise.reject();
        }
        return new Promise((resolve) => {
            resolve(true);
        });

    })
}

instructor.statics.findInstructor = function(instructorId,callback){
    let allInstructor = this;

    let instructor = [];
    allInstructor.find({_id:instructorId}).then((getInstructor) => {
       getInstructor.map(function (Instructor,index) {
          instructor[index] = Instructor.name;
       });
        if(instructor.length>0){
            callback(null,instructor);
        }
        else {
            callback("there is error while fetching data");
        }
    });

};

instructor.statics.addCourseInInstructorAccount = function (idsArray) {
    let instruct = this;
    let idArray = [];
    idsArray.map(function (ids) {
        instruct.findOneAndUpdate({'_id':ids},{$inc:{"courses" : 1}},{useFindAndModify: false}).then((user) => {
            idArray.push(user);

        })
    });
    return new Promise((resolve) => {
        resolve(idArray);
    });
}

instructor.statics.findByCredential = function(email,password){
    let allinstructors = this;
    return allinstructors.findOne({'email':email,'password':password}).then((instruct) => {
        if(instruct){
            return instruct;
        }
        else return false;
    })
}

const Instructor = mongoose.model('Instructor',instructor);
module.exports = {Instructor};
