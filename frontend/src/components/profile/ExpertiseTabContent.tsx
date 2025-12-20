import api from "../../api";

interface ExpertiseTabContentInstructorProps {
  expertiseData: {
    math: boolean;
    physics: boolean;
    it: boolean;
    price: string;
    video: string;
    references: string;
  };
  setExpertiseData: React.Dispatch<
    React.SetStateAction<{
      math: boolean;
      physics: boolean;
      it: boolean;
      price: string;
      video: string;
      references: string;
    }>
  >;
}

const ExpertiseTabContentInstructor = ({
  expertiseData,
  setExpertiseData,
}: ExpertiseTabContentInstructorProps) => {
  /* ===== CHANGE HANDLER ===== */
  const handleExpertiseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setExpertiseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===== SUBMIT HANDLER ===== */
  const handleExpertiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "http://localhost:8080/api/Instructor/update-expertise",
        expertiseData
      );

      console.log(expertiseData);

      if (response.status === 200) {
        alert("Podaci o stručnosti uspješno ažurirani!");
      }
    } catch (err) {
      console.error("Greška prilikom spremanja stručnosti:", err);
      alert("Dogodila se pogreška prilikom spremanja.");
    }
  };

  return (
    <>
      {/* --- EXPERTISE --- */}
      <form
        className="flex flex-col w-[90%] h-[90%]"
        onSubmit={handleExpertiseSubmit}
      >
        <div className="pt-[4%] w-full h-full">
          {/* Područja stručnosti */}
          <label className="font-semibold block mb-3 ml-2">
            Područja stručnosti:
          </label>

          <div className="flex flex-col gap-2 mb-[6%] ml-5">
            <label>
              <input
                type="checkbox"
                name="math"
                checked={expertiseData.math}
                onChange={handleExpertiseChange}
                className="mr-2"
              />
              Matematika
            </label>

            <label>
              <input
                type="checkbox"
                name="physics"
                checked={expertiseData.physics}
                onChange={handleExpertiseChange}
                className="mr-2"
              />
              Fizika
            </label>

            <label>
              <input
                type="checkbox"
                name="it"
                checked={expertiseData.it}
                onChange={handleExpertiseChange}
                className="mr-2"
              />
              Informatika
            </label>
          </div>

          {/* Cjenik */}
          <div className="mb-[4%] flex flex-row ml-2">
            <label className="font-semibold block mb-1">
              Cjenik po satu:
            </label>
            <input
              type="number"
              name="price"
              value={expertiseData.price}
              onChange={handleExpertiseChange}
              className="border border-gray-400 rounded-md px-2 py-1 w-1/3 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] ml-5"
            />
          </div>

          {/* Video */}
          <div className="mb-[4%] flex flex-row p-[1%] ml-2">
            <label className="font-semibold block mb-1">
              Video uvod:
            </label>
            <input
              type="text"
              name="video"
              value={expertiseData.video}
              onChange={handleExpertiseChange}
              className="border border-gray-400 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] ml-5"
            />
          </div>

          {/* Reference */}
          <div className="mb-[4%] flex flex-row p-[1%] ml-2">
            <label className="font-semibold l-3%">
              Reference:
            </label>
            <input
              type="text"
              name="references"
              value={expertiseData.references}
              onChange={handleExpertiseChange}
              className="border border-gray-400 rounded-md px-2 py-1 w-2/5 focus:outline-none focus:ring-1 focus:ring-[#1e3a56] ml-5"
            />
          </div>
        </div>

        <button
        type="submit"
        className="mt-auto bg-[#1e6b84] text-white px-5 py-2 rounded-md self-center"
      >
        Spremi promjene
      </button>
    </form>
    </>
  );
};

export default ExpertiseTabContentInstructor;
