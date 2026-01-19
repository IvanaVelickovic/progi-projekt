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
import InstructorDashboard from "./pages/InstructorDashboard";
import AddSchedule from "./pages/AddSchedule";
import InstructorProfile from "./pages/InstructorProfile/InstructorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import Payment from "./pages/Payment";
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
            element={<ProfileEditInstructor />}
          ></Route>
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          ></Route>
          <Route
            path="/instructor/addSchedule"
            element={<AddSchedule />}
          ></Route>
          <Route
            path="/instructors/:instructorId"
            element={
              //<ProtectedRoute>
              <InstructorProfile />
              //</ProtectedRoute>
            }
          ></Route>
          <Route
            path="/booking-confirmation/:id"
            element={<BookingConfirmation />}
          ></Route>
          <Route path="/payment/:id" element={<Payment />}></Route>
          <Route
            path="/payment-success/:id"
            element={<PaymentSuccess />}
          ></Route>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard></AdminDashboard>}
          ></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
