import { Link } from "react-router-dom";
import GoogleLogo from "../assets/logos/google_logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SocialButtonsProps {
  authType: string;
}

const SocialButtons = ({ authType }: SocialButtonsProps) => {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse.code);
      try {
        const res = await axios.post("http://localhost:3000/google-auth", {
          code: codeResponse.code,
        });
        if (res.status === 200) {
          if (authType === "register") {
            navigate("/setup");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    },
    onError: () => console.log("Google auth failed"),
  });

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
