import { useEffect, useState } from "react";
import axios from "axios";

const ProfileEdit = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "education">("personal");

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const [userData, setUserData] = useState({
    ime: "",
    prezime: "",
    email: "",
  });
  const [educationData, setEducationData] = useState({
    razina: "",
    razred: "",
    ciljevi: "",
  });
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
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "newpassword") {
      validatePassword(value);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/korisnik/1"); 
        const data = response.data;

        setUserData({
          ime: data.firstName || "",
          prezime: data.lastName || "",
          email: data.email || "",
        });

        setEducationData({
          razina: data.educationLevel || "",
          razred: data.grade || "",
          ciljevi: data.learningGoals || "",
        });
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8080/api/user/update", userData);
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
      const response = await axios.post("http://localhost:8080/api/user/change-password", {
        oldPassword: formData.oldpassword,
        newPassword: formData.newpassword,
      });

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

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEducationData(prev => ({ ...prev, [name]: value }));
    if (name === "razina") {
    setEducationData({ razina: value, razred: "", ciljevi: educationData.ciljevi });
    } else {
      setEducationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/user/update-education", educationData);
      if (response.status === 200) {
        alert("Podaci o obrazovanju uspješno ažurirani!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja podataka:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };
  return (
    <div className="bg-[#f6fefb] flex justify-center items-center min-h-screen">
      <div className="w-[90vw] max-w-[1732px] h-auto lg:h-[90vh] bg-[#dff2ea] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10">
        {/* Left section */}
        <div className="flex flex-col items-center text-center w-full lg:w-1/4">
          <h1 className="text-3xl font-bold text-[#1e3a56] mb-8">Moj profil</h1>
          <div className="bg-white rounded-md p-6 shadow-sm flex flex-col items-center">
            <img
              src="images/student_icon.png"
              alt="učenička ikona"
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg text-[#1e3a56] font-semibold">učenik</p>
          </div>
        </div>

        {/* Right section */}
        <div className="bg-green-light flex flex-col justify-center">
          {/* Tab buttons */}
          <div className="flex justify-top w-[45vh] bg-white rounded-md">
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === "personal"
                  ? "text-[#1e3a56]"
                  : "text-gray-400 hover:text-[#1e3a56]"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Osobni podaci
            </button>
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === "education"
                  ? "text-[#1e3a56]"
                  : "text-gray-400 hover:text-[#1e3a56]"
              }`}
              onClick={() => setActiveTab("education")}
            >
              Podaci o obrazovanju
            </button>
          </div>

          {/* Info section */}
          <div className="bg-white w-[100vh] h-[70vh] rounded-md shadow-sm p-[4vh] text-[#1e3a56] transition-all duration-300">
            {activeTab === "personal" ? (
            <>
              <form onSubmit={handlePersonalSubmit} className="flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-1">
                  <div className="p-[1vh]">
                    <label className="font-semibold block mb-1">Ime:</label>
                    <input
                      name="ime"
                      type="text"
                      value={userData.ime}
                      onChange={handleUserChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-20% focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                    />
                  </div>
                  <div className="p-[1vh]">
                    <label className="font-semibold block mb-1">Prezime:</label>
                    <input
                      name="prezime"
                      type="text"
                      value={userData.prezime}
                      onChange={handleUserChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-30% focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                    />
                  <div>
                    <p className="pt-[2vh]">
                      <span className="font-semibold">E-mail:</span> {userData.email || "Učitavanje..."}
                    </p>
                  </div>
                </div>
                </div>

                <button
                  type="submit"
                  className="mx-auto bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition"
                >
                  Spremi promjene
                </button>
              </form>
                {/* Password change */}
                <div className="mt-8 p-[1vh]">
                  <p className="font-semibold mb-3 text-[#1e3a56]">
                    Promjena lozinke:
                  </p>
                  <form className="flex flex-row sm:items-end" onSubmit={handlePasswordSubmit}>
                    <div className="flex flex-row p-[1vh]">
                      <div className="flex flex-col">
                        <label className="text-sm mb-1 p-[1vh]">
                          Trenutna lozinka:
                        </label>
                        <label className="text-sm mb-1 p-[1.5vh]">
                          Nova lozinka:
                        </label>
                      </div>

                      <div className="flex flex-col">
                        <input
                            type="password"
                            name="oldpassword"
                            value={formData.oldpassword}
                            onChange={handleChange}
                            className="border border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] m-[0.5vh]"
                        />
                        <input
                            name="newpassword"
                            value={formData.newpassword}
                            onChange={handleChange}
                            type="password"
                            className="border border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] m-[0.5vh] "
                        />
                        {error && (
                            <p className="mb-2 px-2 bg-red-500/50 text-blue-dark w-[100%] rounded-xs h-[4vh] text-xs content-center flex-wrap">
                            {error}
                            </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-start mt-[3.5vh]"
                    >
                      Promijeni
                    </button>
                  </form>
                </div>
              </>
            ) : (
                <>
                {activeTab === "education" && (
                    <form className="flex flex-col" onSubmit={handleEducationSubmit}>
                        {/* Razina obrazovanja */}
                        <div>
                        <label className="font-semibold block mb-1 pb-[1vh]">Razina obrazovanja:</label>
                        <select
                            name="razina"
                            value={educationData.razina}
                            className="border border-gray-400 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                            onChange={handleEducationChange}
                        >
                            <option value="" disabled>
                            Odaberi razinu
                            </option>
                            <option value="osnovna">Osnovna škola</option>
                            <option value="srednja">Srednja škola</option>
                            <option value="fakultet">Fakultet</option>
                            <option value="ostalo">Ostalo</option>
                        </select>
                        </div>

                        {/* Razred / semestar */}
                        <div>
                        <label className="font-semibold block mb-1 pt-[2vh] pb-[1vh]">Razred/semestar:</label>
                        <select
                            name="razred"
                            value={educationData.razred}
                            className="border border-gray-400 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                            defaultValue=""
                            disabled={!educationData.razina}
                            onChange={handleEducationChange}
                        >
                            <option value="" disabled>
                            {educationData.razina
                              ? "Odaberi razred ili semestar"
                              : "Prvo odaberi razinu"}
                          </option>

                          {/* Osnovna škola */}
                          {educationData.razina === "osnovna" &&
                            Array.from({ length: 8 }, (_, i) => (
                              <option key={i + 1} value={`${i + 1}`}>
                                {i + 1}. razred
                              </option>
                            ))}

                          {/* Srednja škola */}
                          {educationData.razina === "srednja" &&
                            [1, 2, 3, 4].map((r) => (
                              <option key={r} value={`${r}`}>
                                {r}. razred
                              </option>
                            ))}

                          {/* Fakultet */}
                          {educationData.razina === "fakultet" &&
                            [1, 2, 3, 4, 5, 6].map((s) => (
                              <option key={s} value={`${s}s`}>
                                {s}. semestar
                              </option>
                            ))}
                        </select>
                        </div>

                        {/* Ciljevi učenja */}
                        <div>
                        <label className="font-semibold block mb-1 pt-[4vh] pb-[1vh]">Ciljevi učenja:</label>
                        <textarea
                            name="ciljevi"
                            value={educationData.ciljevi}
                            onChange={handleEducationChange}
                            className="border border-gray-400 rounded-md px-2 py-1 w-full h-28 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                        />
                        </div>

                        <button
                        type="submit"
                        className="self-center bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-center"
                        >
                        Spremi promjene
                        </button>
                    </form>            
                )}
                </>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
