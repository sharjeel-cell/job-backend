// import cookieParser from 'cookie-parser';
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './utils/db.js';
// import userRoute from './routes/user.route.js';
// import companyRoute from './routes/company.route.js';
// import jobRoute from './routes/job.route.js';
// import appliRoute from './routes/application.route.js';
// import mongoose from 'mongoose';
// import serverless from 'serverless-http';
// dotenv.config({});
// connectDB();

// const app = express();

// //
// // let isConnected = false;
// // async function connectToMongoDB() {
// //     try {
// //         await mongoose.connect(process.env.MONGO_URI,{
// //             useNewUrlParser : true,
// //             useUnifiedTopology : true
// //         });
// //         isConnected = true;
// //         console.log(process.env.MONGO_URI)
// //         console.log("connected to MongoDB")
// //     } catch (error) {
// //         console.error("Error connecting to MongoDB:",error)
// //     }
// // }


// //Middlewear
// // app.use((req,res,next)=>{
// //     if(!isConnected){
// //         connectToMongoDB();
// //     }
// //     next();
// // })
// // ✅ CORS Configuration
// const allowedOrigins = [
//   'https://job-frontend-cyan.vercel.app',
//   'http://localhost:5173'
// ];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`Not allowed by CORS: ${origin}`));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // ✅ Handle preflight requests


// app.use(express.json());
// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log('Origin:', req.headers.origin);
//   next();
// });


// // const corsOptions = {
// //   origin: [
// //     'https://job-frontend-cyan.vercel.app',
// //     'http://localhost:5173' // for local testing
// //   ],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true, // ✅ must be true for cookies
// // };

// // app.use(cors(corsOptions));

// // // ✅ Optional but helpful (some Vercel setups need this)
// // app.options('*', cors(corsOptions));


// // const corsOptions = {
// //   origin : 'https://job-frontend-cyan.vercel.app',
// //    credentials: true
// // }
// // app.use(cors(corsOptions))
// // const corsoption = {
// //     origin :[
// //       'http://localhost:5173',
// //       'https://job-frontend-cyan.vercel.app'  
// //     ],
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //     credentials : true
// // }
// // app.use(cors(corsoption));


// //const PORT = process.env.PORT || 3000
//  // api's
//  app.use('/api/v1/user',userRoute)
//  app.use('/api/v1/company',companyRoute)
//  app.use('/api/v1/job',jobRoute)
//  app.use('/api/v1/application',appliRoute)

// // ✅ Root route (for Vercel check)
// app.get('/', (req, res) => {
//     res.send('✅ Server is live! Your backend is successfully deployed on Vercel.');
// });

// // app.listen(PORT,()=>{
// //     connectDB()
// //     console.log(`server running at port ${PORT}`)
// // })
// //  do not use app.listen() is vercel
// // export const handler = serverless(app);
 
// export const handler = serverless(app);
// export default app;
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import appliRoute from "./routes/application.route.js";

dotenv.config();
connectDB();

const app = express();
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",")
//   : ["https://job-frontend-cyan.vercel.app"];
const allowedOrigins = [
  "https://job-frontend-cyan.vercel.app",
  "http://localhost:5173",
];
// add dynamic domains 

// ✅ FIXED CORS
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔍 CORS origin check:", origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Always register before any routes
app.use(cors(corsOptions));

// ✅ Disable caching for all responses (important on Vercel)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ✅ Explicitly handle OPTIONS
app.options("*", cors(corsOptions));

// ✅ Body + Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Debug log (optional)
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});
const PORT = process.env.PORT || 3000
// ✅ Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", appliRoute);

// ✅ Root
//app.get("/", (req, res) => {
  //res.send("✅ Server running and CORS working fine!");
//});
app.listen(PORT,()=>{
    connectDB()
     console.log(`server running at port ${PORT}`)
 })
// ✅ Export for Vercel
//export const handler = serverless(app);
export default app;
