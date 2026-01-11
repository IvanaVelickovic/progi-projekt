import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const ProfileViewStudent = () => {
  const { id } = useParams();

  const [studentName, setStudentName] = useState("");
  const [educationData, setEducationData] = useState({
    grade: "",
    knowledgeMath: "",
    knowledgePhi: "",
    knowledgeInf: "",
    goalsMath: "",
    goalsPhi: "",
    goalsInf: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/api/students/${id}`);
        const data = response.data;

        // Ime + prezime
        setStudentName(`${data.first_name} ${data.last_name}`);

        // Podaci za prikaz
        setEducationData({
          grade: data.education.grade || "",
          knowledgeMath: data.education.knowledge_math || "",
          knowledgePhi: data.education.knowledge_phi || "",
          knowledgeInf: data.education.knowledge_inf || "",
          goalsMath: data.goals.math || "",
          goalsPhi: data.goals.phi || "",
          goalsInf: data.goals.inf || "",
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
      <header className="bg-[#9bd7b6] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b3b2e]">
          STEM tutorstvo
        </h1>

        <div className="bg-[#e9f7f1] px-4 py-2 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Pretražite profile"
            className="bg-transparent outline-none text-sm w-[280px]"
          />
        </div>

        <button className="bg-[#0b3b2e] text-white px-6 py-2 rounded-lg">
          Profil
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
          <div className="flex gap-12">
            {/* LIJEVI PANEL */}
            <div className="w-[260px] bg-[#e9f7f1] rounded-2xl p-6
                            flex flex-col items-center justify-center text-center">
              <div className="h-44 w-44 rounded-full bg-[#9bd7b6]
                              flex items-center justify-center mb-4">
                Slika<br />učenika
              </div>

              <p className="font-semibold text-[#0b3b2e] text-lg">
                {studentName}
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
                <span className="font-medium text-lg">
                  Razina obrazovanja:
                </span>

                <div className="bg-gray-100 rounded-lg px-5 py-3 text-lg min-w-[280px] min-h-[48px]">
                  {educationData.grade}
                </div>
              </div>

              {/* RAZINE ZNANJA */}
              <p className="font-medium text-lg mb-5">
                Razine znanja:
              </p>

              <div className="grid grid-cols-3 gap-8 mb-10">
                {[
                  ["Matematika", educationData.knowledgeMath],
                  ["Fizika", educationData.knowledgePhi],
                  ["Informatika", educationData.knowledgeInf],
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
              <p className="font-medium text-lg mb-5">
                Ciljevi učenja:
              </p>

              <div className="grid grid-cols-3 gap-8">
                {[
                  ["Matematika", educationData.goalsMath],
                  ["Fizika", educationData.goalsPhi],
                  ["Informatika", educationData.goalsInf],
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
