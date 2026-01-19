import { useEffect, useState } from "react";
import api from "../api";

import BackBanner from "../components/profile/BackBanner";
import PersonalTabContentInstructor from "../components/profile/PersonalTabContentInstructor";
import ExpertiseTabContentInstructor from "../components/profile/ExpertiseTabContent";
import BiographyTabContentInstructor from "../components/profile/BiographyTabContent";
import ProfileLayoutInstructor from "../components/profile/ProfileLayoutInstructor";

const ProfileEditInstructor = () => {
  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState<
    "personal" | "expertise" | "biography"
  >("personal");

  /* ================= FORM EMPTY STATE ================= */
  const [formEmpty, setFormEmpty] = useState(true);

  /* ================= PERSONAL DATA ================= */
  const [InstructorData, setInstructorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  /* ================= EXPERTISE DATA ================= */
  const [expertiseData, setExpertiseData] = useState({
    math: false,
    physics: false,
    it: false,
    hourlyRate: "",
    introVideoUrl: "",
    references: "",
  });

  /* ================= BIOGRAPHY DATA ================= */
  interface InstructorBiographyData {
    bio: string;
    location: {
      lat: number | null;
      lng: number | null;
      label: string;
    };
  }

  const [biographyData, setBiographyData] = useState<InstructorBiographyData>({
    bio: "",
    location: {
      lat: null,
      lng: null,
      label: "",
    },
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await api.get(
          "http://localhost:8080/api/Instructor/profile"
        );
        const data = response.data;

        /* --- PERSONAL --- */
        setInstructorData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
        });

        /* --- EXPERTISE --- */
        setExpertiseData({
          math: data.math || false,
          physics: data.physics || false,
          it: data.it || false,
          hourlyRate: data.hourlyRate || "",
          introVideoUrl: data.introVideoUrl || "",
          references: data.references || "",
        });

        /* --- BIOGRAPHY --- */
        setBiographyData({
          bio: data.biography || "",
          location: {
            lat: data.latitude ?? null,
            lng: data.longitude ?? null,
            label:
              data.latitude && data.longitude
                ? `Lat: ${data.latitude}, Lng: ${data.longitude}`
                : "",
          },
        });

        // podaci su tek učitani → forma je "čista"
        setFormEmpty(true);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka instruktora:", error);
      }
    };

    fetchInstructorData();
  }, []);

  /* ================= UNSAVED CHANGES ================= */
  useEffect(() => {
    setFormEmpty(false);
  }, [InstructorData, expertiseData, biographyData]);

  /* ================= RENDER ================= */
  return (
    <div className="bg-[#f6fefb] min-h-screen">
      {/* BACK BANNER */}
      <BackBanner formEmpty={formEmpty} backPath="/instructor/dashboard" />

      {/* GLAVNI SADRŽAJ */}
      <div className="flex justify-center items-center">
        <div className="w-[90vw] h-[90vh] min-w-[90%] min-h-[400px] max-h-[600px] max-w-[1732px] lg:h-[90%] bg-[#dff2ea] rounded-2xl shadow-md flex flex-col lg:flex-row items-center p-8 lg:p-12 gap-10 mt-2">
          <ProfileLayoutInstructor
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {activeTab === "personal" && (
              <PersonalTabContentInstructor
                InstructorData={InstructorData}
                setInstructorData={setInstructorData}
              />
            )}

            {activeTab === "expertise" && (
              <ExpertiseTabContentInstructor
                expertiseData={expertiseData}
                setExpertiseData={setExpertiseData}
              />
            )}

            {activeTab === "biography" && (
              <BiographyTabContentInstructor
                biographyData={biographyData}
                setBiographyData={setBiographyData}
              />
            )}
          </ProfileLayoutInstructor>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditInstructor;
