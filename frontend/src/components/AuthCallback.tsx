import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let token = sessionStorage.getItem("stemtutor-token");

    if (!token) {
      const params = new URLSearchParams(window.location.search);
      token = params.get("token");

      if (token) {
        sessionStorage.setItem("stemtutor-token", token);
      }
    }

    if (!token) {
      console.error("Token missing");
      return;
    }

    console.log("Token raw:", token);

    const decoded: any = jwtDecode(token);
    console.log("Decoded:", decoded);
    console.log("Role:", decoded.role);

    setTimeout(() => {
      if (decoded.role === "noRole") {
        console.log("Navigating to /setup");
        navigate("/setup");
      } else {
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      }
    }, 2000);
  }, []);

  return <p className="text-blue-dark">Processing authorization...</p>;
};

export default AuthCallback;
