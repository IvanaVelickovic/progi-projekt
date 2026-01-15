import { jwtDecode } from "jwt-decode";
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
    const checkUser = () => {
      try {
        const storedToken = sessionStorage.getItem("stemtutor-token");
        const token = storedToken ? storedToken : null;

        if (token) {
          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp
            ? decoded.exp * 1000 < Date.now()
            : true;
          if (isExpired) {
            setUser(null);
          } else {
            setUser({
              id: decoded.id,
              name: decoded.name,
            });
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
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
