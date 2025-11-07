import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";
import { useState } from "react";

const Register = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setError("Lozinka mora imati barem 8 znakova!");
    } else if (!/[A-Z]/.test(value)) {
      setError("Lozinka mora imati barem jedno veliko slovo!");
    } else if (!/[0-9]/.test(value)) {
      setError("Lozinka mora sadržavati barem jednu znamenku!");
    } else {
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
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
        >
          <input
            placeholder="Ime"
            type="text"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <input
            placeholder="Prezime"
            type="text"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <input
            placeholder="E-mail adresa"
            type="email"
            className="bg-white rounded text-base p-0.5 border border-blue-dark/50 w-[87.5%] pl-2 placeholder-blue-light/40 mb-4"
            required
          ></input>
          <input
            placeholder="Lozinka"
            type="password"
            value={password}
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
            onClick={(e) => {
              if (error) {
                e.preventDefault();
              }
            }}
          >
            Registriraj se
          </button>
        </form>
        <SocialButtons authType="register"></SocialButtons>
      </div>
    </AuthLayout>
  );
};

export default Register;
