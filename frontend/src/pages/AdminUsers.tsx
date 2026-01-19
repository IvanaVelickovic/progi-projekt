import { useEffect, useState } from "react";

type UserRole = "INSTRUCTOR" | "STUDENT";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
  verified: boolean;
  suspended: boolean;
  lastActive: string;
}

const mockUsers: AdminUser[] = [
  {
    id: 1,
    firstName: "Ime",
    lastName: "Prezime",
    role: "INSTRUCTOR",
    verified: false,
    suspended: false,
    lastActive: "xx.yy.zzzz.",
  },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("err");
        return res.json();
      })
      .then((data: AdminUser[]) => setUsers(data))
      .catch(() => setUsers(mockUsers));
  }, []);

  const verifyUser = async (userId: number) => {
    await fetch(`/api/admin/users/${userId}/verify`, { method: "PUT" });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verified: true } : u))
    );
  };

  const toggleSuspendUser = async (userId: number) => {
    await fetch(`/api/admin/users/${userId}/status`, { method: "PUT" });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, suspended: !u.suspended } : u
      )
    );
  };

  const deleteUser = async (userId: number) => {
    const confirmed = window.confirm("Jeste li sigurni da želite obrisati profil?");
    if (!confirmed) return;

    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
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
              {user.role === "INSTRUCTOR" ? "Instruktor" : "Učenik"}
            </p>

            <div className="flex flex-col gap-3 mt-6">
  <button
    onClick={() => verifyUser(user.id)}
    disabled={user.verified}
    className="bg-blue-dark text-white px-6 py-2 rounded-full disabled:opacity-50 w-56 flex justify-center"
  >
    Verificiraj profil
  </button>

  <button
    onClick={() => toggleSuspendUser(user.id)}
    className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center"
  >
    {user.suspended ? "Aktiviraj profil" : "Suspendiraj profil"}
  </button>

  <button
    onClick={() => deleteUser(user.id)}
    className="bg-blue-dark text-white px-6 py-2 rounded-full w-56 flex justify-center"
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
