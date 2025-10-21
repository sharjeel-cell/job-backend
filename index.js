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


// ✅ Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-frontend-cyan.vercel.app",
  "https://job-frontend-git-main-sharjeel-ahmads-projects-6886ba83.vercel.app"
];


// ✅ CORS Setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

       console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true, // ✅ allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
// ✅ Handle Preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


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

// ✅ Setup CORS
// const corsOptions = {
//   origin: [
//     'http://localhost:5173',
//     'https://job-frontend-cyan.vercel.app',
//     'https://job-frontend-git-main-sharjeel-ahmads-projects-6886ba83.vercel.app' // optional
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // ✅ handle preflight



// const corsoption = {
//     origin :[
//       'http://localhost:5173',
//       'https://job-frontend-cyan.vercel.app'  
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials : true
// }
// app.use(cors(corsoption));


// const PORT = process.env.PORT || 3000
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