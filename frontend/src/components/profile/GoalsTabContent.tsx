//import { useState } from "react";
import api from "../../api";

interface GoalsTabContentProps {
  goalsData: {
    goalsMath: string;
    goalsPhi: string;
    goalsInf: string;
  };
  setGoalsData: React.Dispatch<
    React.SetStateAction<{
      goalsMath: string;
      goalsPhi: string;
      goalsInf: string;
    }>
  >;
}

const GoalsTabContent = ({ goalsData, setGoalsData }: GoalsTabContentProps) => {
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
      const response = await api.post("/api/user/update-goals", goalsData);
      if (response.status === 200) {
        alert("Ciljevi uspješno spremljeni!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja ciljeva:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };

  return (
    <>
      {/* --- GOALS --- */}

      <form className="flex flex-col" onSubmit={handleGoalsSubmit}>
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
    </>
  );
};

export default GoalsTabContent;
