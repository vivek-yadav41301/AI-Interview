import jwt from "jsonwebtoken"


const generateToken=async (userId)=>{
  
  try{
      const Token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
       return Token
  }
  catch(err)
  {
    console.log(err)
  }
  
  
}
export default generateToken