import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      console.log("google nije dao code");
      return;
    }

    (async () => {
      try {
        const res = await axios.post("http://localhost:3000/google-auth", {
          code,
        });
        if (res.status === 200) {
          if (state === "register") navigate("/setup");
          else navigate("/dashboard");
        }
      } catch (err) {
        console.error("Google auth failed: ", err);
      }
    })();
  }, [navigate]);

  return <p>Google autentifikacija u tijeku...</p>;
};

export default GoogleAuth;
