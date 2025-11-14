//import { useState } from "react";
import api from "../../api";

interface EducationTabContentProps {
  educationData: {
    grade: string;
    knowledgeLevelMath: string;
    knowledgeLevelPhi: string;
    knowledgeLevelInf: string;
  };
  setEducationData: React.Dispatch<
    React.SetStateAction<{
      grade: string;
      knowledgeLevelMath: string;
      knowledgeLevelPhi: string;
      knowledgeLevelInf: string;
    }>
  >;
}

const EducationTabContent = ({
  educationData,
  setEducationData,
}: EducationTabContentProps) => {
  const handleEducationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEducationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "http://localhost:8080/api/user/update-education",
        educationData
      );
      console.log(educationData);
      if (response.status === 200) {
        alert("Podaci o obrazovanju uspješno ažurirani!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja podataka:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };
  return (
    <>
      {/* --- EDUCATION --- */}

      <form
        className="flex flex-col w-[90%] h-[90%]"
        onSubmit={handleEducationSubmit}
      >
        <div className="pt-[4%] w-full h-full">
          <div>
            <label className="font-semibold block mb-1 pb-[1%]">
              Razina obrazovanja:
            </label>
            <select
              name="grade"
              value={educationData.grade}
              className="border border-gray-400 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#1e3a56]"
              onChange={handleEducationChange}
            >
              <option value="" disabled>
                Odaberi razinu{" "}
              </option>
              <option value="osnovna škola (1.- 4. razred)">
                Osnovna škola (1.- 4. razred)
              </option>
              <option value="osnovna škola (5.- 8. razred)">
                Osnovna škola (5.- 8. razred)
              </option>
              <option value="srednja">Srednja škola</option>
            </select>
          </div>
          <label className="font-semibold block mb-2 mt-[6%]">
            Razine znanja:
          </label>
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
                <option value="početna_razina">Početna razina</option>
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
    </>
  );
};

export default EducationTabContent;
