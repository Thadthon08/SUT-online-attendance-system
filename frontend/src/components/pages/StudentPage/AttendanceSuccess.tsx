import React from "react";

const AttendanceSuccess: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">Success!</h1>
      <p className="text-lg text-center">You have successfully checked in.</p>
    </div>
  );
};

export default AttendanceSuccess;
