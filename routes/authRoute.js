import bcrypt from 'bcrypt';
import User,{validateUser,validateLogin} from '../models/User.js';
import express from 'express';
import config from 'config';
import joi from 'joi';

const router= express.Router();


router.post('/register', async (req,res)=>{
    try{
        // validate the request if not correct return 400 bad request
        const {error} = validateUser(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        // check if user already exists in DB if exists throw error and do not register
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).json('User is already registered');

            try{
                  // GENERATE NEW PASSWORD
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password,salt);

                // CREATE NEW USER
               const user = new User({
                    username:req.body.username,
                    email:req.body.email,
                    password:hashedPassword,
                });
                // save user and return response
                const newUser = await user.save();
                const {password,...others}=newUser._doc
                res.status(200).json(others);
            }
            catch (err) {
                res.status(400).send(err);
            }
          

    }catch(err){ 
        res.status(400).json(err);

    }
  
});

// LOGIN FUNCTIONALITY
router.post('/login',async (req,res)=>{
    try{   
        const {error}= validateLogin(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send('Sorry User does not exist');

        const validPass = await bcrypt.compare(req.body.password,user.password)
        if(!validPass) return res.status(400).send('Invalid email or password');

        try{
            const token = user.generateAuthToken();
            const {password, ...others} = user._doc;
        
            res.header('x-auth-token', token).status(200).json(others);
        }
        catch(err) {
            res.status(400).json("An error occurred during token generation: " + err.message);
        }
        
    }
    catch(error) {
        res.status(400).json(error);
    }

      
});


export default router;

