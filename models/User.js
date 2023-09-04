import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const {sign,verify} =jwt;
import joi from 'joi';
import config from 'config';


const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },

    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:50
    },
    
    pokemons:[{type:mongoose.Types.ObjectId,ref:'Pokemon',required:true}],


    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:1024
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, admin: this.isAdmin },config.get("jwtprivatekey"));//process.env.TOKEN_SECRET)
    return token;
};

const User = mongoose.model('User',userSchema);


export function validateUser(user){
    const schema=joi.object({
        username:joi.string().min(5).max(50).required(),
        email:joi.string().min(5).max(255).required().email(),
        password:joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

export function validateLogin(req){
    const schema=joi.object({
        email:joi.string().min(5).max(50).email().required(),
        password:joi.string().min(6).max(50).required(),
    });
    return schema.validate(req);
}
export default User;
