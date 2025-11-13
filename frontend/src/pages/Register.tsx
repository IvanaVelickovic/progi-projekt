import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validatePassword = (value: string) => {
    if (value.length > 0) {
      if (value.length < 8) {
        setError("Lozinka mora imati barem 8 znakova!");
      } else if (!/[A-Z]/.test(value)) {
        setError("Lozinka mora imati barem jedno veliko slovo!");
      } else if (!/[0-9]/.test(value)) {
        setError("Lozinka mora sadržavati barem jednu znamenku!");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) {
      return;
    }
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const signupRes = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        formData
      );

      if (signupRes.status === 200 || signupRes.status === 201) {
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

          sessionStorage.setItem("stemtutor-token", JSON.stringify(token));
          const decoded: any = jwtDecode(token);

          setUser({
            id: decoded.id,
            name: decoded.name,
          });

          navigate("/setup");
        }
      }
    } catch (err: any) {
      console.error("Greška u komunikaciji s backendom ", err);
      setError("Došlo je do greške, pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Registracija">
      <div className="bg-green-light/50 h-5/6 w-10/12 rounded-2xl shadow-md shadow-gray-300 flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-blue-dark">Dobro došli!</h2>
        <p className="text-lg text-blue-dark mb-4">
          Za nastavak, molimo registrirajte se:
        </p>
        <form
          method="POST"
          className="flex flex-col justify-center items-center w-11/12"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Ime"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <input
            placeholder="Prezime"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
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
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-1.5"
            required
          ></input>
          {error && (
            <p className="mb-2 px-2 bg-red-500/50 text-blue-dark w-[87.5%] rounded-xs">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-light text-white text-base p-3 px-7.5 rounded-lg cursor-pointer mt-2.5"
          >
            {loading ? "Učitavanje..." : "Registriraj se"}
          </button>
        </form>
        <SocialButtons authType="register"></SocialButtons>
      </div>
    </AuthLayout>
  );
};

export default Register;
