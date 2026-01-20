/* ================= STUDENT DASHBOARD PAGE ================= */
// Glavna stranica za studente s terminima, video sesijama i kvizovima

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import StudentSchedule from "../components/StudentSchedule";
import StudentOnlineSessions from "../components/StudentOnlineSessions";
import SessionSummaries from "../components/SessionSummaries";
import { getStudentVideoSessions } from "../services/sessionService";
import type { VideoSession } from "../services/sessionService";

interface Appointment {
  id: number;
  dateTime: string;
  format: string;
  duration: number;
  price: number;
  filled: number;
  maxParticipants: number;
  subject: string;
  instructorName: string;
  instructorId: number;
}

interface OnlineSession {
  id: number;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "live" | "completed";
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const clickedStyle =
    "flex items-center w-[89%] h-[80%] bg-[#ADEBC8]/67 rounded-4xl";
  const defaultStyle = "flex items-center w-[89%] h-[80%]";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>([]);

  /* ================= ACTIVE SESSION REDIRECT ================= */
  // Preusmjerava korisnika na session-complete ako se vratio iz video sesije
  useEffect(() => {
    const checkActiveSession = () => {
      const returnPending = localStorage.getItem('session_return_pending');
      if (returnPending !== 'true') return;

      const sessionId = localStorage.getItem('active_session_id');
      if (!sessionId) {
        localStorage.removeItem('session_return_pending');
        return;
      }

      const status = localStorage.getItem(`session_${sessionId}_status`);
      if (status !== 'in_progress') {
        localStorage.removeItem('session_return_pending');
        return;
      }

      // ===== PROVJERA: Mora proći barem 10 sekundi od starta =====
      const startTime = localStorage.getItem(`session_${sessionId}_start`);
      if (startTime) {
        const start = new Date(startTime);
        const now = new Date();
        const secondsElapsed = (now.getTime() - start.getTime()) / 1000;
        
        if (secondsElapsed < 10) {
          console.log(`⏱️ Sesija još nije počela (${Math.round(secondsElapsed)}s) - preskačem redirect`);
          return;
        }
      }

      console.log('🔁 StudentDashboard → redirect na session-complete');
      localStorage.removeItem('session_return_pending'); // Potroši flag da nema loopa
      navigate(`/session-complete/${sessionId}`, { replace: true });
    };

    // 1️⃣ Provjeri ODMAH pri mount-u
    checkActiveSession();

    // 2️⃣ Provjeri kada korisnik vrati FOKUS na tab
    const handleFocus = () => {
      console.log('👁️ Window focus event - provjeravam aktivne sesije');
      checkActiveSession();
    };

    // 3️⃣ Provjeri kada tab postane VISIBLE
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Visibility change - provjeravam aktivne sesije');
        checkActiveSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Mock data - u produkciji bi se koristio pravi API
        const mockAppointments = [
          {
            id: 1,
            dateTime: "2026-01-20T16:00:00",
            format: "uživo",
            duration: 90,
            price: 35,
            filled: 2,
            maxParticipants: 4,
            subject: "Matematika - Integrali",
            instructorName: "Marko Horvat",
            instructorId: 101,
          },
          {
            id: 2,
            dateTime: "2026-01-22T14:00:00",
            format: "online",
            duration: 60,
            price: 25,
            filled: 3,
            maxParticipants: 5,
            subject: "Fizika - Mehanika",
            instructorName: "Ana Kovač",
            instructorId: 102,
          },
        ];
        setAppointments(mockAppointments);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchOnlineSessions = async () => {
      try {
        // Dohvaćanje podataka iz backenda
        const sessions = await getStudentVideoSessions();
        // Validacija da je odgovor niz
        if (Array.isArray(sessions)) {
          setOnlineSessions(sessions);
        } else {
          console.warn("Backend nije vratio niz sesija:", sessions);
          setOnlineSessions([]);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju online sesija:", error);
        // Postavi prazan niz u slučaju greške
        setOnlineSessions([]);
      }
    };

    fetchOnlineSessions();
  }, []);

  /* ================= RENDER ================= */
  return (
    <div className="h-screen">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
        <div className="flex items-center bg-[#D9D9D9] w-5/12 rounded-3xl cursor-pointer">
          <img src="/images/search_icon.png" className="w-11 ml-2"></img>
          <p
            className="text-blue-dark/60 font-bold text-xl ml-1"
            onClick={() => {
              navigate("/schedules/search");
            }}
          >
            Pretražite termine
          </p>
        </div>
        <button
          className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Profil
        </button>
      </div>

      <div className="flex h-5/6">
        <div className="flex justify-center w-1/5 bg-[#F8FFFC] ">
          <div className="bg-green-light h-8/12 mt-22 w-11/12 rounded-2xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
            <ul className="h-full p-1">
              <li
                className="flex items-center justify-center h-1/4 cursor-pointer"
                onClick={() => setSelected(1)}
              >
                <div className={selected == 1 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/termin_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Termini</p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/4 cursor-pointer"
                onClick={() => setSelected(2)}
              >
                <div className={selected == 2 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/video_sesije_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">
                    Video sesije
                  </p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/4 cursor-pointer"
                onClick={() => setSelected(3)}
              >
                <div className={selected == 3 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/kvizovi_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Kvizovi</p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/4 cursor-pointer"
                onClick={() => setSelected(4)}
              >
                <div className={selected == 4 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/termin_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Obavijesti</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-4/5">
          {selected == 1 && (
            <StudentSchedule
              search={false}
              appointments={appointments}
            ></StudentSchedule>
          )}
          {selected == 2 && (
            <StudentOnlineSessions sessions={onlineSessions} />
          )}
          {selected == 3 && <p className="p-8 text-blue-dark text-2xl">Kvizovi - uskoro!</p>}
          {selected == 4 && <SessionSummaries userType="student" />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;