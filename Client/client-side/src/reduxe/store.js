import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice.js'
 const store= configureStore({
  reducer: {
    user:userSlice//userSlice.reducer hai actual ma ya
  },
})
export default store