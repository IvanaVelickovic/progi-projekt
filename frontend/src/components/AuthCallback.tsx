import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthCallback = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      console.error("token read incorrectly from url");
    } else {
      sessionStorage.setItem("stemtutor-token", JSON.stringify(token));
      const decoded: any = jwtDecode(token);

      const authType = decoded.role;

      setUser({
        id: decoded.id,
        name: decoded.name,
      });

      if (authType === "register") {
        navigate("/setup");
      } else if (authType === "login") {
        navigate("/dashboard");
      } else {
        console.error("wrong authtype saved");
      }
    }
  }, []);

  return <p className="text-blue-dark">Processing authorization...</p>;
};

export default AuthCallback;
