const jwt = require('jsonwebtoken');
const {User} = require('../model/user');
const {Instructor} = require('../model/instructor');

const access = 'auth';

const addUser = async (req,res) => {
    const user = new User({
        name:req.body.fname,
        email:req.body.eml,
        password:req.body.pswd,
        role:req.body.role
    });

    try {
        let result = await User.findByEmail(req.body.eml);
        user.save().then(async () => {
            let token = await jwt.sign({_id: user._id, access}, 'abc123').toString();
            let userObject = {
                ...user.toJSON(),token
            }
            res.status(200).send(userObject);
        }).catch((e) => {
            res.status(400).send({message:"error in user register"});
        });
    }
    catch(e){

        res.status(401).send({message:"email is already exist"});
    }
}

const loginUser = async (req,res) => {
    try{
        let user = await User.findByCredential(req.body.eml,req.body.pswd);
        if (!user) {
            user = await Instructor.findByCredential(req.body.eml, req.body.pswd);
        }
        let token = jwt.sign({_id: user._id,access},'abc123').toString();
        let userObject = {
            ...user.toJSON(),token
        }
        res.status(200).send(userObject);
    }
    catch(e){
        res.status(401).send({message:"un authorize user.."});
    }
}

const addUserCart = async (req,res) => {
    const userCartData = new Object({
        uid:req.body.u_id,
        cartData: req.body.cartData
    });

    try {
        const userCart = await User.addUserCart(userCartData);
        if(userCart){
            res.status(200).send(userCart.cartData);
        }
        else {
            res.status(400).send({error_msg:'there is an error while add Cart data.'});
        }
    }
    catch (e) {
        res.status(500).send({error_msg:'there is an error while passing data.'});
    }
}

module.exports = {
    addUser,
    loginUser,
    addUserCart
}
