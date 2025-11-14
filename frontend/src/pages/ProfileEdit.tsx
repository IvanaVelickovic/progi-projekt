import { useEffect, useState } from "react";
import api from "../api";
import ProfileLayout from "../components/profile/ProfileLayout";
import PersonalTabContent from "../components/profile/PersonalTabContent";
import EducationTabContent from "../components/profile/EducationTabContent";
import GoalsTabContent from "../components/profile/GoalsTabContent";

const ProfileEdit = () => {
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "goals"
  >("personal");

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(
          "http://localhost:8080/api/user/profile"
        );
        const data = response.data;
        console.log(data);

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

  return (
    <div className="bg-[#f6fefb] flex justify-center items-center min-h-screen">
      <div className="w-[90vw] h-[90vh] min-w-[90%] min-h-[400px] max-h-[600px] max-w-[1732px] max-w[90%] lg:h-[90%] bg-[#dff2ea] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10">
        <ProfileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "personal" && (
            <PersonalTabContent userData={userData} setUserData={setUserData} />
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
  );
};

export default ProfileEdit;
