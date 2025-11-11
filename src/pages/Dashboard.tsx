import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col bg-[#F8FFFC] h-screen w-screen">
        <div className="flex justify-between items-end p-10 bg-green-dark/50 h-1/5">
          <h1 className="text-blue-dark text-5xl font-bold">STEM tutorstvo</h1>
          <button
            className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Profil
          </button>
        </div>
        <div className="flex justify-around items-center h-4/5 ">
          <div className="text-blue-dark text-4xl font-bold">
            Dobro došli, {user?.name}!
          </div>
          <img
            src="/images/home_page.png"
            alt="logo homepagea"
            className="h-4/5"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
