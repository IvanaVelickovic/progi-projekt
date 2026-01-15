import { useEffect, useState } from "react";
import api from "../api";

import BackBanner from "../components/profile/BackBanner";
import EducationTabContent from "../components/profile/EducationTabContent";
import GoalsTabContent from "../components/profile/GoalsTabContent";
import PersonalTabContent from "../components/profile/PersonalTabContent";
import ProfileLayout from "../components/profile/ProfileLayout";

const ProfileEdit = () => {
  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "goals"
  >("personal");

  /* ================= FORM EMPTY STATE ================= */
  const [formEmpty, setFormEmpty] = useState(true);

  /* ================= USER DATA ================= */
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  /* ================= EDUCATION DATA ================= */
  const [educationData, setEducationData] = useState({
    grade: "",
    knowledgeLevelMath: "",
    knowledgeLevelPhi: "",
    knowledgeLevelInf: "",
  });

  /* ================= GOALS DATA ================= */
  const [goalsData, setGoalsData] = useState({
    goalsMath: "",
    goalsPhi: "",
    goalsInf: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(
          "http://localhost:8080/api/user/profile"
        );
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

        // nakon učitavanja – forma je čista
        setFormEmpty(true);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };

    fetchUserData();
  }, []);

  /* ================= UNSAVED CHANGES ================= */
  useEffect(() => {
    setFormEmpty(false);
  }, [userData, educationData, goalsData]);

  /* ================= RENDER ================= */
  return (
    <div className="bg-[#f6fefb] min-h-screen">
      {/* BACK BANNER */}
      <BackBanner formEmpty={formEmpty} backPath="/dashboard" />

      {/* GLAVNI SADRŽAJ */}
      <div className="flex justify-center items-center">
        <div className="w-[90vw] h-[90vh] min-w-[90%] min-h-[400px] max-h-[600px] max-w-[1732px] lg:h-[90%] bg-[#dff2ea] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10 mt-2">
          <ProfileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "personal" && (
              <PersonalTabContent
                userData={userData}
                setUserData={setUserData}
              />
            )}

            {activeTab === "education" && (
              <EducationTabContent
                educationData={educationData}
                setEducationData={setEducationData}
              />
            )}

            {activeTab === "goals" && (
              <GoalsTabContent
                goalsData={goalsData}
                setGoalsData={setGoalsData}
              />
            )}
          </ProfileLayout>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
