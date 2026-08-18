import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
function Footer() {
  return (
    <div className="bg-orange-50  flex justify-center px-4 py-4 pb-10 pt-10">
      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 py-8 px-3 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-red-400 text-white p-2 rounded-lg">
            <RiRobot2Fill size={16} />
          </div>
          <h2 className="font-semibold">InterviewIQ</h2>
        </div>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </div>
  );
}

export default Footer;
