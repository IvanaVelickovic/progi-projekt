import { Link } from "react-router-dom";
import GoogleLogo from "../assets/logos/google_logo.png";

interface SocialButtonsProps {
  authType: string;
}

const SocialButtons = ({ authType }: SocialButtonsProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const googleLogin = () => {
    sessionStorage.setItem("auth-type", JSON.stringify(authType));
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };
  return (
    <>
      <div className="flex items-center justify-center w-3/4 my-2.5">
        <div className="border border-blue-dark w-1/2 mr-2"></div>
        <span className="text-blue-dark text-base">ili</span>
        <div className="border border-blue-dark w-1/2 ml-2"></div>
      </div>
      <div className="flex justify-around w-3/4 text-base">
        <button
          className="flex justify-center items-center border-3 border-blue-light rounded-xl bg-white py-1.5 px-3 text-blue-dark w-full cursor-pointer text-[1.05rem]"
          onClick={googleLogin}
        >
          <img
            src={GoogleLogo}
            className="h-7 w-7 mr-2.5"
            alt="google logo"
          ></img>
          Google
        </button>
      </div>
      <div className="flex justify-center mt-3.5 text-blue-dark">
        <p>{authType === "register" ? "Već imate račun?" : "Nemate račun?"}</p>
        <Link
          to={authType === "register" ? "/login" : "/register"}
          className="ml-2.5 font-bold underline"
        >
          {authType === "register" ? "Prijava" : "Registracija"}
        </Link>
      </div>
    </>
  );
};

export default SocialButtons;
