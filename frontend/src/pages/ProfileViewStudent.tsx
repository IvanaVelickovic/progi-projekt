import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const ProfileViewStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ovo mora biti stvarni ID u URL-u

  const [studentName, setStudentName] = useState("");
  const [educationData, setEducationData] = useState({
    grade: "",
    knowledgeLevelMath: "",
    knowledgeLevelPhi: "",
    knowledgeLevelInf: "",
    learningGoalsMath: "",
    learningGoalsPhi: "",
    learningGoalsInf: "",
  });

  useEffect(() => {
    if (!id) return; // ako nema id, ne radi fetch

    const fetchStudent = async () => {
      try {
        const response = await api.get(`/api/students/${id}`);
        const data = response.data;

        // Ime i prezime
        setStudentName(`${data.first_name} ${data.last_name}`);

        // Podaci o obrazovanju i ciljevi
        setEducationData({
          grade: data.grade || "",

          knowledgeLevelMath: data.knowledge_data_math || "",
          knowledgeLevelPhi: data.knowledge_data_phi || "",
          knowledgeLevelInf: data.knowledge_data_inf || "",

          learningGoalsMath: data.learning_goals_math || "",
          learningGoalsPhi: data.learning_goals_phi || "",
          learningGoalsInf: data.learning_goals_inf || "",
        });
      } catch (error) {
        console.error("Greška pri dohvaćanju studenta:", error);
      }
    };

    fetchStudent();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#e9f7f1] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[105px] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
        <button
          className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Profil
        </button>
      </div>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 text-blue-dark">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
          <div className="flex gap-12">
            {/* LIJEVI PANEL */}
            <div className="w-[260px] bg-[#e9f7f1] rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="h-44 w-44 rounded-full bg-[#9bd7b6] flex items-center justify-center mb-4">
                Slika
                <br />
                učenika
              </div>
              <p className="font-semibold text-blue-dark text-lg">
                {studentName || "NEMA IMENA"}
              </p>
            </div>

            {/* DESNI DIO */}
            <div className="flex-1">
              <div className="mb-8">
                <span className="bg-[#dff3ea] px-5 py-2 rounded-xl font-medium text-lg">
                  Podaci o obrazovanju
                </span>
              </div>

              {/* RAZINA OBRAZOVANJA */}
              <div className="flex items-center gap-5 mb-10">
                <span className="font-medium text-lg">Razina obrazovanja:</span>
                <div className="bg-gray-100 rounded-lg px-5 py-3 text-lg min-w-[280px]">
                  {educationData.grade}
                </div>
              </div>

              {/* RAZINE ZNANJA */}
              <p className="font-medium text-lg mb-5">Razine znanja:</p>
              <div className="grid grid-cols-3 gap-8 mb-10">
                {[
                  ["Matematika", educationData.knowledgeLevelMath],
                  ["Fizika", educationData.knowledgeLevelPhi],
                  ["Informatika", educationData.knowledgeLevelInf],
                ].map(([name, value]) => (
                  <div key={name}>
                    <p className="text-base font-medium mb-2">{name}:</p>
                    <div className="bg-gray-100 rounded-lg px-5 py-3 text-lg min-h-[48px]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CILJEVI UČENJA */}
              <p className="font-medium text-lg mb-5">Ciljevi učenja:</p>
              <div className="grid grid-cols-3 gap-8">
                {[
                  ["Matematika", educationData.learningGoalsMath],
                  ["Fizika", educationData.learningGoalsPhi],
                  ["Informatika", educationData.learningGoalsInf],
                ].map(([name, value]) => (
                  <div key={name}>
                    <p className="text-base font-medium mb-2">{name}:</p>
                    <div className="bg-gray-100 rounded-md px-4 py-3 text-base min-h-[80px]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileViewStudent;
