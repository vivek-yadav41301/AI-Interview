import mongoose from 'mongoose'
const connectDb=async ()=>{
    try{
      await mongoose.connect(process.env.DB_URL)
      console.log("DATABASE is connected ")
    }
    catch(err)
    {
      console.log(`DB ERROR ->  ${err}`)
    }
    
}
export default connectDb;