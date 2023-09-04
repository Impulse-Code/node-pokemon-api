import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import auth from '../middleware/auth.js';
const router=express.Router();

// GET ALL USERS
router.get('/',auth, async (req,res)=>{
    let users;
    try{
        users = await User.find();
        !users && res.status(404).json('No users found in the database');

        res.status(200).json({users});
    }
    catch(err){

    }
});

// GET SINGLE USER
// router.get('/:id',auth, async(req,res) => {
//     try{
//         const user = await User.findById(req.params.id);
//         if(!user) return res.status(404).json('Sorry the Specified user could not be found');

//         const {password,...others}=user._doc
//         res.status(200).json(others);
//     }
//     catch(err){
//         return res.status(400).json(error.details[0].message) 
//     }

// });

// GET CURRENT USER SAFELY
router.get('/me',auth ,async (req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
})

// UPDATE A USER
router.put('/:id', auth, async(req,res) => {
    if(req.body.id === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password =await bcrypt.hash(req.body.password,salt);
                }
            catch(error){
                return res.status(400).json(error.details[0].message)
            }
            try{
                const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
                res.status(200).json(`User Account for ${ user.username} has been updated successfully`); 
            }catch(error){
                return res.status(400).json(error.details[0].message)
            }
        }else{
            return res.status(403).json('You can update only your account');
        }
    }

});

// DELETE A USER
router.delete('/:id',auth, async(req,res)=>{
    if(req.body.id === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json(`Account of user ${user.username} has been deleted `);
        }catch (error){
            return res.status(400).json(error.details[0].message)
        }
    }else{
      return res.status(403).send(`Specified user account could not be found`);
    }
})

export default router;