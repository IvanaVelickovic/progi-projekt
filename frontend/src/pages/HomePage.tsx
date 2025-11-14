import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col bg-[#FFFFFF] h-screen w-screen">
        <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-1/6 shadow">
          <h1 className="text-blue-dark text-5xl font-bold">STEM tutorstvo</h1>
          <div className="flex justify-around w-1/4">
            <button
              className=" text-blue-dark text-2xl font-bold p-3 rounded-lg cursor-pointer w-5/12 min-w-52"
              onClick={() => navigate("/register")}
            >
              Registracija
            </button>
            <button
              className=" text-blue-dark text-2xl font-bold p-3 rounded-lg cursor-pointer w-5/12 min-w-52"
              onClick={() => navigate("/login")}
            >
              Prijava
            </button>
          </div>
        </div>
        <div className="flex justify-around items-center h-4/5">
          <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="text-blue-dark text-5xl font-bold p-16">
              Instrukcije iz informatike, fizike i matematike
            </div>
            <div className="text-2xl text-blue-dark">
              Uživo ili online - za osnovnu, srednju školu i fakultet.
            </div>
          </div>
          <img
            src="/images/home_page.png"
            alt="logo homepagea"
            className="h-11/12"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
