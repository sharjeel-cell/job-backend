import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title :{
        type : String,
        requried :true
    },
     description :{
        type : String,
        requried :true
    },
     requirements :[{
        type : String
     }],
     salary :{
        type : Number,
        requried: true
     },
     experienceLevel:{
       type : Number,
       requried : true
     },
     location :{
        type : String,
        requried : true
     },
     jobType :{
        type: String,
        requried : true
     },
     position :{
        type: Number,
        requried : true
     },
     company :{
        type : mongoose.Schema.Types.ObjectId,
        ref :'company',
        requried: true
     },
     created_by:{
        type : mongoose.Schema.Types.ObjectId,
        ref :  'user',
        requried : true
     },
     applications :[{
         type : mongoose.Schema.Types.ObjectId,
        ref :'application'
     }]

},{timestamps:true})
export const Job = mongoose.model("job",jobSchema)