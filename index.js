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
import serverless from 'serverless-http';
dotenv.config({});

const app = express();

//
// let isConnected = false;
// async function connectToMongoDB() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI,{
//             useNewUrlParser : true,
//             useUnifiedTopology : true
//         });
//         isConnected = true;
//         console.log(process.env.MONGO_URI)
//         console.log("connected to MongoDB")
//     } catch (error) {
//         console.error("Error connecting to MongoDB:",error)
//     }
// }


//Middlewear
// app.use((req,res,next)=>{
//     if(!isConnected){
//         connectToMongoDB();
//     }
//     next();
// })

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://job-frontend-cyan.vercel.app',
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`❌ Not allowed by CORS: ${origin}`));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

// ✅ Optional manual headers (extra safety for Vercel)
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions = {
  origin: [
    'https://job-frontend-cyan.vercel.app',
    'http://localhost:5173' // for local testing
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // ✅ must be true for cookies
};

app.use(cors(corsOptions));

// ✅ Optional but helpful (some Vercel setups need this)
app.options('*', cors(corsOptions));


// const corsOptions = {
//   origin : 'https://job-frontend-cyan.vercel.app',
//    credentials: true
// }
// app.use(cors(corsOptions))
// const corsoption = {
//     origin :[
//       'http://localhost:5173',
//       'https://job-frontend-cyan.vercel.app'  
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials : true
// }
// app.use(cors(corsoption));


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
// export const handler = serverless(app);
 
// export default serverless(app);
export default app;