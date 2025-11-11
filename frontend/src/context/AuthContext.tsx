import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
    setLoading(false);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/*useEffect(() => {
    //setUser({ id: "1", name: "Ana", email: "ana@gmail.com", role: "student" });
    const fetchUser = async () => {
      try {
        const res = await axios.get("/current-user", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
    setLoading(false);
  }, []);*/
