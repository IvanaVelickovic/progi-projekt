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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data: AdminUser[]) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const verifyUser = async (userId: number) => {
    await fetch(`/api/admin/users/${userId}/verify`, {
      method: "PUT",
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, verified: true } : u
      )
    );
  };

  const suspendUser = async (userId: number) => {
    await fetch(`/api/admin/users/${userId}/suspend`, {
      method: "PUT",
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, suspended: true } : u
      )
    );
  };

  const deleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      "Jeste li sigurni da želite obrisati profil?"
    );
    if (!confirmed) return;

    await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-10">
      <input
        type="text"
        placeholder="Pretražite korisnike"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-1/2 px-4 py-2 rounded-xl border"
      />

      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="bg-[#CFF5DF] border-2 border-blue-dark rounded-2xl p-6 mb-6 flex justify-between"
        >
          <div>
            <h2 className="text-blue-dark font-bold text-xl">
              {user.firstName} {user.lastName}
            </h2>

            <p className="text-blue-dark">
              {user.role === "INSTRUCTOR" ? "Instruktor" : "Učenik"}
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => verifyUser(user.id)}
                disabled={user.verified}
                className="bg-blue-dark text-white px-4 py-1 rounded-xl disabled:opacity-50"
              >
                Verificiraj profil
              </button>

              <button
                onClick={() => suspendUser(user.id)}
                disabled={user.suspended}
                className="bg-blue-dark text-white px-4 py-1 rounded-xl disabled:opacity-50"
              >
                Suspendiraj profil
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-blue-dark text-white px-4 py-1 rounded-xl"
              >
                Obriši profil
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <div className="bg-gray-200 px-4 py-2 rounded-xl text-sm">
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
