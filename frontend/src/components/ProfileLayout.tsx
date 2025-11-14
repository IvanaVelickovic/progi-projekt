//import { useState } from "react";

interface ProfileLayoutProps {
  activeTab: "personal" | "education" | "goals";
  setActiveTab: (tab: "personal" | "education" | "goals") => void;
  children: React.ReactNode;
}

const ProfileLayout = ({
  activeTab,
  setActiveTab,
  children,
}: ProfileLayoutProps) => {
  return (
    <>
      {/* Left section */}
      <div
        className="flex flex-col items-center text-center 
                      w-full 
                      sm:w-3/4 
                      md:w-1/2 
                      lg:w-1/3 
                      xl:w-1/4"
      >
        <h1 className="text-3xl font-bold text-[#1e3a56] mb-8">Moj profil</h1>

        <div className="bg-white rounded-md p-6 shadow-sm flex flex-col items-center">
          <img
            src="images/student_icon.png"
            alt="učenička ikona"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4"
          />
          <p className="text-lg text-[#1e3a56] font-semibold">učenik</p>
        </div>
      </div>

      {/* Right section */}
      <div className="bg-green-light flex flex-col justify-center w-[60%] h-[80%] min-h-[600px]">
        {/* Tab buttons */}
        <div className="flex justify-top w-[55%] bg-white rounded-md">
          <button
            className={`px-4 py-2 font-semibold text-sm ${
              activeTab === "personal"
                ? "text-[#1e3a56]"
                : "text-gray-400 hover:text-[#1e3a56]"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Osobni podaci
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm ${
              activeTab === "education"
                ? "text-[#1e3a56]"
                : "text-gray-400 hover:text-[#1e3a56]"
            }`}
            onClick={() => setActiveTab("education")}
          >
            Podaci o obrazovanju
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm ${
              activeTab === "goals"
                ? "text-[#1e3a56]"
                : "text-gray-400 hover:text-[#1e3a56]"
            }`}
            onClick={() => setActiveTab("goals")}
          >
            Ciljevi učenja
          </button>
        </div>
        {/* Info section */}
        <div className="bg-white w-[90%] max-w-[800px] min-h-[400px] h-[500px] max-h-[80vh] rounded-md shadow-sm p-6 text-[#1e3a56] transition-all duration-300">
          {children}
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
