import express from 'express'
   import * as authController from '../controllers/auth.controller.js'

const authRouter=express.Router();
authRouter.post("/google",authController.googleAuth)
authRouter.get("/logout",authController.logOut)

export default authRouter