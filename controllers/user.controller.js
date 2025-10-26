
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User} from '../models/user.model.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
export const register = async (req,res)=>{
    try {
        const {fullname,email,password,phoneNumber,role} = req.body
        console.log(fullname,email,password,phoneNumber,role)
        if(!fullname || !email || !password || !phoneNumber || !role){
            return res.status(400).json({
                message :'someting is missing',
                success : false
            })
        }
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
    let user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message : "user can be alredy exist",
                success : false
            })
        }
        console.log('Password:', password); 
        const hashedPassword = await bcrypt.hash(password,10)
        await User.create({
            fullname,
            email,
            password:hashedPassword,
            phoneNumber,
            role,
            profile:{
                profilePhoto: cloudResponse.secure_url,
            }
        })
        return res.status(201).json({
            message : 'Account Created Successfully',
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password,role} = req.body
        if(!email || !password || !role){
            return res.status(400).json({
                message : 'someting is missing',
                success : false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : 'incorrect email and password',
                success: false
            })
        }
        const ispasswordMatch = await bcrypt.compare(password,user.password)
        if(!ispasswordMatch){
            return res.status(400).json({
                message : "incorrect email and password",
                success : false
            })
        }
        // check role is correct or not
        if(role != user.role){
            return res.status(400).json({
                message : 'Account does not exist in this role',
                success : false
            })
        };
        const tokenData ={
            userId :user._id
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})
        
        User ={
            _id:user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile : user.profile
        }
        //strict
        return res.status(200).cookie('token',token,{maxAge:1*24*60*60*1000,httpOnly:true,secure:process.env.NODE_ENV === "production",sameSite:'none'}).json(
            {
                message: `welcome back ${user.fullname}`,
                 user,
                success : true
            }
        )
    } catch (error) {
        console.log(error)
    }
}
export const logout = async(req,res)=>{
    try {
        return res.status(201).cookie('token','',{maxAge:0}).json({
            message :'logged out successfully',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const updateProfile = async (req,res)=>{
    try {
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        const file = req.file;
           if(!fullname || !email || !phoneNumber|| !bio || !skills){
            return res.status(400).json({
                message :'someting is missing',
                success : false
            })
        }
        // cloudniary aye gi yaha par
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


        const skillsArray = skills.split(',');
        const userId = req.id  // middlewear authentication
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:'user not to be a found ', 
                success :false
            })
        }
        // updating the data in to new format
        if(fullname)  user.fullname = fullname
        if(email)    user.email = email 
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio)       user.profile.bio = bio
        if(skillsArray)     user.profile.skills = skillsArray
        
         // resume come later here
          if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname
          }

        await user.save()
        user ={
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile : user.profile
        }
        return res.status(200).json({
            message :'profile updated Succesfully',
            user,
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}