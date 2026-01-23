import api from "../../api";

interface PersonalTabContentProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  setUserData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
    }>
  >;
}

const PersonalTabContent = ({
  userData,
  setUserData,
}: PersonalTabContentProps) => {
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

  return (
    <>
      {/* --- PERSONAL --- */}
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
              <span className="font-semibold">E-mail:</span>{" "}
              {userData.email || "Učitavanje..."}
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
    </>
  );
};

export default PersonalTabContent;
