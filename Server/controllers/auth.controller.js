
import mongoose from 'mongoose'
import User from '../models/user.model.js'
import generateToken from '../utils/token.js'


//login controller
export async function googleAuth(req,res)
{
  try
  { 
    const {name,email}=req.body
    let user=await User.findOne({email})
    if(!user)
    {
      user= await  User.create({name,email})

    }
   let token= await  generateToken(user._id)

    

    res.cookie("token",token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7*24*60*60*1000
  })
  return res.status(200).json(user)

  }
  catch(err)
  {
    return res.status(500).json({
        message:`Google auth error ${err}`
    })
  }
}
//logout Controller
export async function logOut(req,res) {
    try{
        await res.clearCookie("token")
        return res.status(200).json({
            message:"LogOut Successfully"
        })

    }
    catch(err)
    {
     return  res.status(500).json({
        message:`LogOut error ${err}`
    })
    }
    
}

//find current user
export async function getCurrentUser(req,res){
try
{ const userId=req.userId
    const user=await User.findById(userId)
    if(!user)
    {
        return res.status(404).json({message:"user does not found OR exit"})
    }
    return res.status(200).json(user)

}
catch(err)
{
    return res.status(500).json({ message:`failed to get current user:${err}`})
}
}