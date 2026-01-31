// src/pages/jlpt/JLPTHome.tsx
import { Outlet } from "react-router-dom";

const JLPTHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Outlet />
    </div>
  );
};

export default JLPTHome;
