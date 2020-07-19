const {ObjectID} = require("mongodb");
const path = require("path");

const {CourseSchema} = require('../model/course');
const {Subcategoryschemas} = require('../model/subcategory.model');
const {Instructor} = require('../model/instructor');
const async = require('async');

const addCourse = async function(req,res) {
    const courseSchema = new CourseSchema({
        category_Id:req.body.category_Id,
        category_Name:req.body.category_Name,
        created_By:req.body.created_By,
        language:req.body.language,
        course_Name:req.body.course_Name,
        course_Subtitle:req.body.course_Subtitle,
        learn:req.body.learn,
        course_content:req.body.course_content,
        requirement:req.body.requirement,
        description:req.body.description,
        price:req.body.price,
        offer:req.body.offer
    });
    try {
        const Id = courseSchema.category_Id;
        const createdBy = courseSchema.created_By;
        const category_Name = courseSchema.category_Name;
        if(ObjectID.isValid(Id)){
            Instructor.distinct('_id').lean().then(async (ids) => {
                const result = createdBy.map(function (id) {
                    ids = JSON.parse(JSON.stringify(ids));
                    if (!ids.includes(id)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                if (result.includes(false)) {
                    res.status(400).send({message: "id doesn't represent any instructor."});
                } else {
                    const category = await Subcategoryschemas.findCourseById(Id);

                    const results = await Instructor.addCourseInInstructorAccount(createdBy);


                    if (category.subcategoryArray.includes(category_Name)) {
                        courseSchema.save().then(async () => {
                            res.status(200).send({message: "course added successfully"});
                        });

                    } else {
                        res.status(400).send({message: "there is invalid category added by you"});
                    }
                }
            });
        }
        else {
            res.status(400).send({message:"there is invalid category_id added by you"});
        }
    }
    catch (e) {
        res.status(400).send({message:"error while adding course"});
    }
};

const addCourseVideo = function (req,res) {
    let course_Id = req.body.course_Id;
    let course_Img = req.files[0].path;
    let course_video = req.files[1].path;
    let imgObj = path.format({dir:'http://localhost:3004',base:course_Img});
    let videoObj = path.format({dir:'http://localhost:3004',base:course_video});
    try {
        CourseSchema.updateOne({_id:course_Id},{$set: {course_Img: imgObj, course_video: videoObj}}).then((get_data) => {
            res.status(200).send("course image added or update successfully.");
        });
    }
    catch (e) {
        res.status(400).send("there is an error while Adding course image.");
    }
};


const getAllcourse = async function (req, res) {
    try {
        let courseupdate = [];
        _getCourse(async (error, result) => {
            if (error) {
                res.status(404).send("error while getting courses.");
            } else {
                try {
                    _getInstructorName(result,(error,resp) => {
                        if(error){
                            res.status(404).send("error while mapping instructor name.");
                        }
                        else {
                            res.status(200).send(resp);
                        }
                    });
                }
                catch (e) {
                    res.status(400).send(e);
                }
            }
        });
    }
    catch (e) {
        res.status(400).send({message: "there is an error to get all courses."});
}
};

function _getCourse(callback){
    CourseSchema.find((error, result)=>{
        if(error){
            return callback(error);
        }
        return callback(null,result);
    })
}

function _getInstructorName(result, callback) {
    async.eachSeries(result, (course, cb) => {
        Instructor.findInstructor(course.created_By,(error,resp) => {
            if(error){
                return cb(error);
            }
            course.created_By = resp;
            return cb();
        });
    }, (eachSeriesErr) => {
        if (eachSeriesErr) {
          return callback(eachSeriesErr);
        }
        return callback(null, result);
    });
}

module.exports = {
    addCourse,
    getAllcourse,
    addCourseVideo
};
