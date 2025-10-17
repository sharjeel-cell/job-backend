
import { Company } from "../models/company.model.js";
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
export const registercompany = async (req,res)=>{
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message : "company name is requried",
                success : false
            })
        }
        let company = await Company.findOne({name:companyName});
         if(company) {
            return res.status(400).json({
               message: "company same can't be register",
               success : false
            })
         }
         company = await Company.create({
            name :companyName,
            userId:req.id,
         })
         res.status(201).json({
            message : 'comapny registered succesfully',
            success : true,
            company
         })
        
    } catch (error) {
        console.log(error)
    }
}

export const getCompany = async (req,res)=>{
    try {
        const userId = req.id;  // logged in user id
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(400).json({
                message :"companies not found",
                success : false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getCompanyById = async (req,res)=>{
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(400).json({
                message: "company not found",
                success : false
            })
        }
        return res.status(200).json({
            company,
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}
export const updateCompany = async (req,res)=>{
   try {
    const {name , description , website , location} = req.body;
    const file = req.file;
    // yaha par cloudnary aye ga
     const fileUri = getDataUri(file);
     const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
     const logo = cloudResponse.secure_url;

    const updateData = {name , description , website , location,logo}
    const company = await Company.findByIdAndUpdate(req.params.id,updateData , {new:true})
     if(!company){
        return res.status(400).json({
            message :"company not found",
            success : false
        })
     }
     return res.status(200).json({
        message : "company information updated",
        success : true
     })
} catch (error) {
     console.log(error)
   }
}