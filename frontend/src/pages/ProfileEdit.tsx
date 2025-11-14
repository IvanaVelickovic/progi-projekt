import { useEffect, useState } from "react";
import api from "../api";

const ProfileEdit = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "education" | "goals">("personal");

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [educationData, setEducationData] = useState({
    grade: "",
    knowledgeLevelMath: "",
    knowledgeLevelPhi: "",
    knowledgeLevelInf: "",
  });

  const [goalsData, setGoalsData] = useState({
    goalsMath: "",
    goalsPhi: "",
    goalsInf: "",
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
        const response = await api.get("http://localhost:8080/api/user/profile"); 
        const data = response.data;

        setUserData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
        });

        setEducationData({
          grade: data.grade || "",
          knowledgeLevelMath: data.knowledge_data_math || "",
          knowledgeLevelPhi: data.knowledge_data_phi || "",
          knowledgeLevelInf: data.knowledge_data_inf || "",
        });

        setGoalsData({
          goalsMath: data.learning_goals_math || "",
          goalsPhi: data.learning_goals_phi || "",
          goalsInf: data.learning_goals_inf || "",
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
      const response = await api.post("http://localhost:8080/api/user/change-password", {
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
    if (name === "grade") {
    setEducationData({ grade: value, knowledgeLevelMath: "", knowledgeLevelPhi: "", knowledgeLevelInf: "" });
    } else {
      setEducationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("http://localhost:8080/api/user/update-education", educationData);
      if (response.status === 200) {
        alert("Podaci o obrazovanju uspješno ažurirani!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja podataka:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGoalsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("http://localhost:8080/api/user/update-goals", goalsData);
      if (response.status === 200) {
        alert("Ciljevi uspješno spremljeni!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja ciljeva:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };

  return (
    <div className="bg-[#f6fefb] flex justify-center items-center min-h-screen">
      <div className="w-[90%] h-[90%] min-w-[90%] min-h-[90%] max-w-[1732px] max-w[90%] lg:h-[90%] bg-[#dff2ea] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10">
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
        <div className="bg-green-light flex flex-col justify-center w-[60%] h-[70%]">
          {/* Tab buttons */}
          <div className="flex justify-top w-[55%] bg-white rounded-md">
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
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === "goals"
                  ? "text-[#1e3a56]"
                  : "text-gray-400 hover:text-[#1e3a56]"
              }`}
              onClick={() => setActiveTab("goals")}
            >
              Ciljevi učenja
            </button>
          </div>

          {/* Info section */}
        <div className="bg-white w-[100%] h-[100%] rounded-md shadow-sm p-[4%] text-[#1e3a56] transition-all duration-300">

          {/* --- PERSONAL --- */}
          {activeTab === "personal" && (
            <>
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
                      <span className="font-semibold">E-mail:</span> {userData.email || "Učitavanje..."}
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
                <form className="flex flex-row sm:items-end " onSubmit={handlePasswordSubmit}>
                  <div className="flex flex-row p-[1%]">
                    <div className="flex flex-col mb-[2%]">
                      <label className="text-sm mb-[3%] p-[1%]">Trenutna lozinka:</label>
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
          )}

          {/* --- EDUCATION --- */}
          {activeTab === "education" && (
            <form className="flex flex-col w-[90%] h-[90%]" onSubmit={handleEducationSubmit}>
              <div className="pt-[4%] w-[100%] h-[100%]">
                <div> 
                  <label className="font-semibold block mb-1 pb-[1%]">
                    Razina obrazovanja:
                  </label> 
                  <select name="grade" value={educationData.grade} 
                    className="border border-gray-400 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]" 
                    onChange={handleEducationChange} > 
                    <option value="" disabled> 
                      Odaberi razinu </option> 
                    <option value="osnovna škola (1.- 4. razred)">Osnovna škola (1.- 4. razred)</option>
                    <option value="osnovna škola (5.- 8. razred)">Osnovna škola (5.- 8. razred)</option>  
                    <option value="srednja">Srednja škola</option> 
                  </select> 
                </div>
                <label className="font-semibold block mb-2 mt-[6%]">Razine znanja:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[16.1%]">
                  {/* Matematika */}
                  <div>
                    <label className="block text-sm mb-1">Matematika:</label>
                    <select
                      name="knowledgeLevelMath"
                      value={educationData.knowledgeLevelMath}
                      onChange={handleEducationChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                    >
                      <option value="">Odaberi razinu</option>
                      <option value="početna_razina">Početnak razina</option>
                      <option value="srednja_razina">Srednja razina</option>
                      <option value="napredna_razina">Napredna razina</option>
                    </select>
                  </div>

                  {/* Fizika */}
                  <div>
                    <label className="block text-sm mb-1">Fizika:</label>
                    <select
                      name="knowledgeLevelPhi"
                      value={educationData.knowledgeLevelPhi}
                      onChange={handleEducationChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#1e3a56] "
                    >
                      <option value="">Odaberi razinu</option>
                      <option value="početna_razina">Početnak razina</option>
                      <option value="srednja_razina">Srednja razina</option>
                      <option value="napredna_razina">Napredna razina</option>
                    </select>
                  </div>

                  {/* Informatika */}
                  <div>
                    <label className="block text-sm mb-1">Informatika:</label>
                    <select
                      name="knowledgeLevelInf"
                      value={educationData.knowledgeLevelInf}
                      onChange={handleEducationChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                    >
                      <option value="">Odaberi razinu</option>
                      <option value="početna_razina">Početnak razina</option>
                      <option value="srednja_razina">Srednja razina</option>
                      <option value="napredna_razina">Napredna razina</option>
                    </select>
                  </div>
                  
                </div>
                
              </div>
              <button
                type="submit"
                className="mt-[8%] bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-center"
              >
                Spremi promjene
              </button>
            </form>
          )}

          {/* --- GOALS --- */}
          {activeTab === "goals" && (
            <form
              className="flex flex-col"
              onSubmit={handleGoalsSubmit}
            >
              <h2 className="text-lg font-semibold mb-4">Ciljevi učenja</h2>

              <div className="mb-4">
                <label className="font-semibold block mb-1">Matematika:</label>
                <textarea
                  name="goalsMath"
                  value={goalsData.goalsMath}
                  onChange={handleGoalsChange}
                  className="border border-gray-400 rounded-md px-2 py-1 w-full h-[8%] focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold block mb-1">Fizika:</label>
                <textarea
                  name="goalsPhi"
                  value={goalsData.goalsPhi}
                  onChange={handleGoalsChange}
                  className="border border-gray-400 rounded-md px-2 py-1 w-full h-[8%] focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold block mb-1">Informatika:</label>
                <textarea
                  name="goalsInf"
                  value={goalsData.goalsInf}
                  onChange={handleGoalsChange}
                  className="border border-gray-400 rounded-md px-2 py-1 w-full h-[8%] focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1e6b84] text-white px-5 py-2 rounded-md hover:bg-[#145a6f] transition self-center"
              >
                Spremi ciljeve
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default ProfileEdit;
