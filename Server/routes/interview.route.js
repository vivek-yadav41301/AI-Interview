import express from 'express'
import isAuth from '../middleware/isAuth.js';
import {upload} from '../middleware/multer.js'
import { analyzeResume, finishInterview, submitAnswer ,generateQuestions, getMyInterviews, getInterviewReport} from '../controllers/interview.controller.js';
import { get } from 'mongoose';
const interviewRouter=express.Router();
interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
 interviewRouter.post('/generate-questions',isAuth,generateQuestions)
 interviewRouter.post('/submit-answer',isAuth,submitAnswer)
 interviewRouter.post("/finish",isAuth,finishInterview)
 interviewRouter.get("/get-interview",isAuth,getMyInterviews)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)
 
export default interviewRouter