import React from 'react'
import { buildStyles,CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function Timer({timeLeft,totalTime}) {
    const percentage=(timeLeft/totalTime)*100
  return (
   <div className='w-20 h-20'>
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: "#10b981", // Emerald Green
          textColor: "#111827", // Dark Gray/Black for readable text
          trailColor: "#e5e7eb", // Light gray background ring
        })}
      />
    </div>
  )
}

export default Timer
