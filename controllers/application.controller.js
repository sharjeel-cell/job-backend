import { Application } from '../models/application.model.js';
import { Job } from "../models/job.model.js";

export const applyJob = async (req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message : "job id is requried",
                success : false
            })
        }
        // check the user can be alredy apply or not
        const existingApplication = await Application.findOne({job:jobId,application:userId})
        if(existingApplication){
            return res.status(400).json({
                message : " user can alredy apply this job",
                success : false
            })
        }
        // check if the job is exist
        const job = await Job.findById(jobId);
       if(!job){
        return res.status(400).json({
            message : "job can not to be found",
            success : false
        })
       }
        // create a new applcation 
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        })
        job.applications.push(newApplication._id)
        await job.save();
        return res.status(201).json({
            message : "job appliced can successfuly",
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getAppliedJob = async (req,res)=>{
  try {
    const userId = req.id;
    const applications = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path : 'job',
        options :{sort:{createdAt:-1}},
        populate:{
            path : 'company',
            options:{sort:{createdAt:-1}}
        }
    })
    if(!applications){
        return res.status(400).json({
            message : "jobs can not be found",
            success : false
        })
    }
    return res.status(200).json({
       applications,
        success : true
    })
  } catch (error) {
    console.log(error)
  }
}
// admin check kare ga k ketne persons ne apply kya ha
export const getApplicant = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path : 'applications',
            options :{sort:{createdAt:-1}},
        populate:{
            path : "applicant"
        }
    })
        if(!job){
            return res.status(404).json({
                message : "job can not be found",
                success : false
            })
        }
        return res.status(200).json({
             job,
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}
export const updateStatus = async (req,res)=>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        console.log('applicationId',applicationId)
        if(!status){
            return res.status(400).json({
                message : "status is required",
                success : false
            })
        }
   //find the application by application id
   const applications = await Application.findOne({_id:applicationId})
    console.log('Found application:', applications);
   if(!applications){
    return res.status(404).json({
        message : "application Id is not found",
        success : false
    })
   }
        applications.status = status.toLowerCase();
        await applications.save();
        return res.status(200).json({
             message : "status update successfuly",
             success : true,
        })
    } catch (error) {
        console.log(error)
    }
}