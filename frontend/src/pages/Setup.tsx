import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Setup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const chooseRole = async (
    e: React.MouseEvent<HTMLButtonElement>,
    role: string
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const res = await axios.post(
        `${API_BASE_URL}/setup`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
              "stemtutor-token"
            )}`,
          },
        }
      );

      const newToken = res.data.token;
      sessionStorage.setItem("stemtutor-token", newToken);

      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error while updating role", err);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Odaberite način registracije:">
      <div className="bg-green-light/50 h-5/6 w-10/12 rounded-2xl shadow-md shadow-gray-300 flex flex-col justify-center items-center">
        <button
          className="flex justify-around items-center w-11/12 bg-blue-light text-white text-base p-3 py-5 px-7.5 rounded-lg cursor-pointer mb-6"
          onClick={(e) => {
            chooseRole(e, "student");
          }}
        >
          <img
            src="/images/student_icon.png"
            alt="ikona studenta"
            className="h-10/12 mr-4"
          ></img>
          <div className="flex flex-col justify-start">
            <div className="text-lg font-bold text-white text-left">Učenik</div>
            <div className="text-base text-left text-gray-200 text-[0.9rem]">
              Pristupite instrukcijama, rješavajte zadatke i pratite vlastiti
              napredak kroz platformu.
            </div>
          </div>
        </button>
        <button
          className="flex justify-around items-center w-11/12 bg-blue-light text-white text-base p-3 py-5 px-7.5 rounded-lg cursor-pointer"
          onClick={(e) => {
            chooseRole(e, "instructor");
          }}
        >
          <img
            src="/images/Instruktor_icon.png"
            alt="ikona instruktora"
            className="h-10/12 mr-4"
          ></img>
          <div className="flex flex-col justify-start">
            <div className="text-lg font-bold text-white text-left">
              Instruktor
            </div>
            <div className="text-base text-left text-gray-200 text-[0.9rem]">
              Održavajte instrukcije, dodajte materijale za učenje i povežite se
              s učenicima.
            </div>
          </div>
        </button>
        {loading && (
          <p className="mt-2 text-lg text-blue-dark font-bold ">Loading...</p>
        )}
      </div>
    </AuthLayout>
  );
};

export default Setup;
