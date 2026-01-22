import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

type UserRole = "instructor" | "student";

interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  verified: boolean;
  status: string;
  lastLogin: string;
  createdAt: string;
}

const mockUsers: AdminUser[] = [
  {
    userId: 1,
    firstName: "Ime",
    lastName: "Prezime",
    role: "instructor",
    verified: false,
    status: "",
    lastLogin: "xx.yy.zzzz.",
    createdAt: "xx.yy.zzzz.",
    email: "ime@prezime.com",
  },
];

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/users");
        setUsers(res.data);
      } catch (error) {
        setUsers(mockUsers);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (datetime: string) => {
    const [date, time] = datetime?.split("T");
    return [date, time.substring(0, 7)];
  };

  const verifyUser = async (userId: number) => {
    try {
      await api.put(`/api/admin/users/${userId}/verify`);

      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, verified: true } : u)),
      );
    } catch (error) {
      console.error("Verification failed", error);
      // eventualno obavijest korisnika
    }
  };

  const toggleSuspendUser = async (userId: number) => {
    const user = users.filter((prev) => prev.userId === userId).at(0);
    let status = user?.status === "banned" ? "active" : "banned";

    try {
      await api.put(`/api/admin/users/${userId}/status`, {
        status: status,
      });

      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, status: status } : u)),
      );
    } catch (error) {
      console.error("Failed to toggle suspend status", error);
    }
  };

  const deleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite obrisati profil?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);

      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (error) {
      console.error("Brisanje korisnika nije uspjelo", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-10 bg-[#EFFFF6] h-full">
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Pretražite korisnike"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3 px-6 py-2 rounded-full bg-gray-100 shadow"
        />
      </div>

      {filteredUsers.map((user) => (
        <div
          key={user.userId}
          className="bg-[#CFF5DF] border-2 border-blue-dark rounded-2xl p-8 mb-8 flex justify-between"
        >
          <div>
            <h2 className="text-blue-dark font-bold text-2xl">
              <span
                className="cursor-pointer hover:text-blue-dark/70"
                onClick={() => navigate(`/${user.role}s/${user.userId}`)}
              >
                {user.firstName} {user.lastName}
              </span>{" "}
              <span className="font-normal text-sxl">
                ({user.role === "instructor" ? "Instruktor" : "Učenik"})
              </span>
            </h2>

            <p className="text-blue-dark mt-1 text-lg">{user.email}</p>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => verifyUser(user.userId)}
                disabled={user.verified}
                className="bg-blue-dark text-white px-6 py-2 rounded-full disabled:opacity-50 w-56 flex justify-center cursor-pointer"
              >
                Verificiraj profil
              </button>

              <button
                onClick={() => toggleSuspendUser(user.userId)}
                className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center cursor-pointer"
              >
                {user.status === "banned"
                  ? "Aktiviraj profil"
                  : "Suspendiraj profil"}
              </button>

              <button
                onClick={() => deleteUser(user.userId)}
                className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center cursor-pointer"
              >
                Obriši profil
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-2 ">
            <div className="bg-gray-200 px-10 py-3 rounded-xl text-sm text-blue-dark">
              Račun kreiran:
              <br />
              {formatDate(user.createdAt)[0]} {"  "}
              {formatDate(user.createdAt)[1]}
            </div>
            <div className="bg-gray-100 px-10 py-3 rounded-xl text-sm text-blue-dark">
              Posljednja aktivnost:
              <br />
              {formatDate(user.lastLogin)[0]} {"  "}
              {formatDate(user.lastLogin)[1]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
