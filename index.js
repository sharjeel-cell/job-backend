import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import appliRoute from './routes/application.route.js';
import mongoose from 'mongoose';
dotenv.config({});


const app = express();

let isConnected = false;
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        isConnected = true;
        console.log("connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB:",error)
    }
}


//Middlewear
app.use((req,res,next)=>{
    if(!isConnected){
        connectToMongoDB();
    }
    next();
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsoption = {
    origin :['http://localhost:5173',
      'https://job-frontend-cyan.vercel.app'  
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials : true
}
app.use(cors(corsoption));

const PORT = process.env.PORT || 3000
 // api's
 app.use('/api/v1/user',userRoute)
 app.use('/api/v1/company',companyRoute)
 app.use('/api/v1/job',jobRoute)
 app.use('/api/v1/application',appliRoute)

// ✅ Root route (for Vercel check)
app.get('/', (req, res) => {
    res.send('✅ Server is live! Your backend is successfully deployed on Vercel.');
});

// app.listen(PORT,()=>{
//     connectDB()
//     console.log(`server running at port ${PORT}`)
// })
//  do not use app.listen() is vercel
 
export default app;