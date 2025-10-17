import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAdminJobs, getAllJobs, getJobById, postJob } from '../controllers/job.controller.js';

const router = express.Router();
router.route('/post').post(isAuthenticated,postJob);
router.route('/get').get(isAuthenticated,getAllJobs)
router.route('/get/:id').get(isAuthenticated,getJobById)
router.route('/getadminjobs').get(isAuthenticated,getAdminJobs)
export default router;

// {
//     "title": "frontend Developer",
//     "description": "I want frontend Developer to my company",
//     "requriments": "React.js,Next js and API testing",
//     "salary": 60,
//     "location": "faisalabad",
//     "jobType": "full time",
//     "experience": 1,
//     "position": 12,
//     "companyId": "68b8d0aaa483404e081f9335"
// }