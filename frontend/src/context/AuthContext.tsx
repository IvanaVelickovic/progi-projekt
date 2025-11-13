import axios from "axios";
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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const checkUser = async () => {
      const storedToken = sessionStorage.getItem("stemtutor-token");
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (token) {
        try {
          //backend check if the token is still valid
          const userRes = await axios.get(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
