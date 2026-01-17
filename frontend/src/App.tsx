import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/HomePage";
import Login from "./pages/Login";
import ProfileEdit from "./pages/ProfileEdit";
import Register from "./pages/Register";
import Setup from "./pages/Setup";
import InstructorDashboard from "./pages/InstructorDashboard";
import AddSchedule from "./pages/AddSchedule";
import AddQuiz from "./pages/AddQuiz";
import StudentDashboard from "./pages/StudentDashboard";
import SolveQuiz from "./pages/SolveQuiz";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/oauth2/callback" element={<AuthCallback />}></Route>
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <Setup />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/profile" element={<ProfileEdit />}></Route>
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          ></Route>
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          ></Route>
          <Route
            path="/instructor/addSchedule"
            element={<AddSchedule />}
          ></Route>
          <Route path="/instructor/addQuiz" element={<AddQuiz />}></Route>
          <Route path="/solve/quiz/:quiz_id" element={<SolveQuiz />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
