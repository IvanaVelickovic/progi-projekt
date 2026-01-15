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
import StudentDashboard from "./pages/StudentDashboard";
import Search from "./pages/Search";
import ProfileViewStudent from "./pages/ProfileViewStudent";
import ProfileEditInstructor from "./pages/ProfileEditInstructor";
import BookingConfirmation from "./pages/reservation";
import Payment from "./pages/payment";
import PaymentSuccess from "./pages/PaymentSuccess";

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
            path="/student/dashboard"
            element={<StudentDashboard />}
          ></Route>
          <Route path="/schedules/search" element={<Search />}></Route>
          <Route path="/students/:id" element={<ProfileViewStudent />} />
          <Route
            path="/profileInstructor"
            element={
                <ProfileEditInstructor />
            }
          ></Route>
          <Route
            path="/BookingConfirmation"
            element={
                <BookingConfirmation />
            }
          ></Route>
          <Route
            path="/payment"
            element={
                <Payment />
            }
          ></Route>
          <Route
            path="/payment-success"
            element={
                <PaymentSuccess />
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
