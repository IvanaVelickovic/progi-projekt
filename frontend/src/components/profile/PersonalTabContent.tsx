import { useState } from "react";
import api from "../../api";

interface PersonalTabContentProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  setUserData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
    }>
  >;
}

const PersonalTabContent = ({
  userData,
  setUserData,
}: PersonalTabContentProps) => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const [error, setError] = useState("");

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

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
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "newpassword") {
      validatePassword(value);
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("http://localhost:8080/api/user/update", userData);
      alert("Podaci uspješno ažurirani!");
    } catch (error) {
      console.error(error);
      alert("Greška prilikom ažuriranja podataka.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.oldpassword === formData.newpassword) {
      setError("Nova lozinka ne može biti ista kao trenutna lozinka.");
      return;
    }
    try {
      const response = await api.post(
        "http://localhost:8080/api/user/change-password",
        {
          oldPassword: formData.oldpassword,
          newPassword: formData.newpassword,
        }
      );

      if (response.status === 200) {
        alert("Lozinka uspješno promijenjena!");
        setFormData({ oldpassword: "", newpassword: "" });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("Trenutna lozinka nije točna!");
      } else {
        alert("Greška prilikom promjene lozinke.");
      }
    }
  };

  return (
    <>
      {/* --- PERSONAL --- */}
      <form onSubmit={handlePersonalSubmit} className="flex flex-row">
        <div className="flex flex-col w-[50%]">
          <div className="p-[1%]">
            <label className="font-semibold block mb-1">Ime:</label>
            <input
              name="firstName"
              type="text"
              value={userData.firstName}
              onChange={handleUserChange}
              className="border border-gray-400 rounded-md px-2 py-1 w-[80%] focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
            />
          </div>

          <div className="p-[1%]">
            <label className="font-semibold block mb-1">Prezime:</label>
            <input
              name="lastName"
              type="text"
              value={userData.lastName}
              onChange={handleUserChange}
              className="border border-gray-400 rounded-md px-2 py-1 w-[80%] focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
            />
          </div>

          <div>
            <p className="pt-[2%] p-[1%]">
              <span className="font-semibold">E-mail:</span>{" "}
              {userData.email || "Učitavanje..."}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mb-[2.5%] bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-center"
        >
          Spremi promjene
        </button>
      </form>

      {/* --- PROMJENA LOZINKE --- */}
      <div className="mt-8 p-[1%]">
        <p className="font-semibold mb-3 text-[#1e3a56]">Promjena lozinke:</p>
        <form
          className="flex flex-row sm:items-end "
          onSubmit={handlePasswordSubmit}
        >
          <div className="flex flex-row p-[1%]">
            <div className="flex flex-col mb-[2%]">
              <label className="text-sm mb-[3%] p-[1%]">
                Trenutna lozinka:
              </label>
              <label className="text-sm mb-[3%] p-[1.5%]">Nova lozinka:</label>
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                name="oldpassword"
                value={formData.oldpassword}
                onChange={handleChange}
                className="border border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] mb-[2%] m-[0.5%]"
              />
              <input
                type="password"
                name="newpassword"
                value={formData.newpassword}
                onChange={handleChange}
                className="border border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] mb-[2%] m-[0.5%]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-start mt-[3.5%]"
          >
            Promijeni
          </button>
        </form>
        {error && (
          <p className="mb-[6.6%] px-2 bg-red-500/50 text-white w-[42%] rounded h-[6%] text-xs flex items-center ml-[13.5%]">
            {error}
          </p>
        )}
      </div>
    </>
  );
};

export default PersonalTabContent;
