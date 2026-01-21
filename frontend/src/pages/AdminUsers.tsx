import { useEffect, useState } from "react";
import api from "../api";

type UserRole = "instructor" | "student";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
  verified: boolean;
  status: string;
  lastActive: string;
}

const mockUsers: AdminUser[] = [
  {
    id: 1,
    firstName: "Ime",
    lastName: "Prezime",
    role: "instructor",
    verified: false,
    status: "",
    lastActive: "xx.yy.zzzz.",
  },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/users?page=1&size=20");
        const content = res.data.content;

        setUsers(
          content.map((u: any) => ({
            id: u.userId,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            verified: u.verified,
            status: u.status,
            lastActive: u.lastLogin,
          })),
        );
      } catch (error) {
        setUsers(mockUsers);
      }
    };

    fetchUsers();
  }, []);

  const verifyUser = async (userId: number) => {
    try {
      await api.put(`/api/admin/users/${userId}/verify`);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, verified: true } : u)),
      );
    } catch (error) {
      console.error("Verification failed", error);
      // eventualno obavijest korisnika
    }
  };

  const toggleSuspendUser = async (userId: number) => {
    const user = users.filter((prev) => prev.id === userId).at(0);
    let status = user?.status === "banned" ? "active" : "banned";

    try {
      await api.put(`/api/admin/users/${userId}/status`, {
        status: status,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: status } : u)),
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

      setUsers((prev) => prev.filter((u) => u.id !== userId));
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
          key={user.id}
          className="bg-[#CFF5DF] border-2 border-blue-dark rounded-2xl p-8 mb-8 flex justify-between"
        >
          <div>
            <h2 className="text-blue-dark font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-blue-dark mt-1">
              {user.role === "instructor" ? "Instruktor" : "Učenik"}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => verifyUser(user.id)}
                disabled={user.verified}
                className="bg-blue-dark text-white px-6 py-2 rounded-full disabled:opacity-50 w-56 flex justify-center cursor-pointer"
              >
                Verificiraj profil
              </button>

              <button
                onClick={() => toggleSuspendUser(user.id)}
                className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center cursor-pointer"
              >
                {user.status === "banned"
                  ? "Aktiviraj profil"
                  : "Suspendiraj profil"}
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center cursor-pointer"
              >
                Obriši profil
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <div className="bg-gray-200 px-6 py-3 rounded-xl text-sm text-blue-dark">
              Posljednja aktivnost:
              <br />
              {user.lastActive}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
