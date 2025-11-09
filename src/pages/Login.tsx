import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/login", formData);
      if (res.status === 200) {
        //check backend confirmation
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
      </div>
    </AuthLayout>
  );
};

export default Login;
