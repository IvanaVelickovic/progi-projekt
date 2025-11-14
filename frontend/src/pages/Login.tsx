import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (loginRes.status === 200) {
        const token = loginRes.data.token;
        if (!token) {
          setError("Login failed: token not received");
          setLoading(false);
          return;
        }

        sessionStorage.setItem("stemtutor-token", token);
        const decoded: any = jwtDecode(token);

        setUser({
          id: decoded.id,
          name: decoded.name,
        });

        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        window.alert("Krivi email ili lozinka");
      }
      console.error("Greška u komunikaciji s backendom", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <AuthLayout title="Prijava">
      <div className="bg-green-light/50 h-5/6 w-10/12 rounded-2xl shadow-md shadow-gray-300 flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-blue-dark">
          Dobro došli natrag!
        </h2>
        <p className="text-lg text-blue-dark mb-4">
          Za nastavak, molimo prijavite se:
        </p>
        <form
          method="POST"
          className="flex flex-col justify-center items-center w-11/12"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="E-mail adresa"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <input
            placeholder="Lozinka"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <button
            type="submit"
            className="bg-blue-light text-white text-base p-3 px-7.5 rounded-lg cursor-pointer"
          >
            {loading ? "Učitavanje..." : "Prijava"}
          </button>
        </form>
        <SocialButtons authType="login"></SocialButtons>
        {error && (
          <p className="mt-3 text-blue-dark bg-red-500/50 px-5">{error}</p>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
