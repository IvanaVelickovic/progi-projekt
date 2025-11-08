import { Link } from "react-router-dom";
import GoogleLogo from "../assets/logos/google_logo.png";
import MicrosoftLogo from "../assets/logos/microsoft_logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";

interface SocialButtonsProps {
  authType: string;
}

const SocialButtons = ({ authType }: SocialButtonsProps) => {
  const { instance } = useMsal();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      fetch("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
      });
    },
    onError: () => console.log("Google auth failed"),
  });

  const microsoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["User.Read"],
      });

      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: loginResponse.account,
      });

      const accessToken = tokenResponse.accessToken;

      await fetch("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken }),
      });
    } catch (e) {
      console.log("Microsoft login error: ", e);
    }
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
          className="flex justify-center items-center border-3 border-blue-light rounded-xl bg-white py-1 px-3 text-blue-dark w-5/12 cursor-pointer"
          onClick={googleLogin}
        >
          <img src={GoogleLogo} className="h-7 w-7 mr-1.5"></img>
          Google
        </button>
        <button
          className="flex justify-center items-center border-3 border-blue-light rounded-xl px-3 py-2 bg-white text-blue-dark cursor-pointer"
          onClick={microsoftLogin}
        >
          <img src={MicrosoftLogo} className="h-6 w-6 mr-2"></img>
          Microsoft
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
