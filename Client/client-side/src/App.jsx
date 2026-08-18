import React, { useEffect } from 'react'
import Auth from './pages/Auth'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import { linkWithCredential } from 'firebase/auth'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import { setUserData } from './reduxe/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
function App() {
   const dispatch=useDispatch();
useEffect(()=>{
 
   const getUser=async()=>{
     try{
      const result=await axios.get(import.meta.env.VITE_SERVER_URL+"/api/user/current-user",{
        withCredentials:true
      })
      dispatch(setUserData(result.data))
      console.log("current user:",result.data)

     }catch(err)
     {
       console.log(err)
       dispatch(setUserData(null))
     }
   }
    getUser()
   
},[dispatch])

  return (
    <div>
     
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/auth' element={<Auth/>}></Route>
         <Route path='/interview' element={<InterviewPage/>}></Route>
          <Route path='/history' element={<InterviewHistory/>}></Route>
           <Route path='/pricing' element={<Pricing/>}></Route>
        
          <Route path='/report/:id' element={<InterviewReport/>}></Route>
        
      </Routes>
    </div>
  )
}
export default App
