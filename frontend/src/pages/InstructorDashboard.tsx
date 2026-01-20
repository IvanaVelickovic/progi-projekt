/* ================= INSTRUCTOR DASHBOARD ================= */
// Dashboard za instruktore sa terminima, video sesijama i kvizovima

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Schedule from "../components/Schedule";
import InstructorVideoSessions from "../components/InstructorVideoSessions";
import SessionSummaries from "../components/SessionSummaries";

// ===== Glavna komponenta =====
const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const clickedStyle =
    "flex items-center w-[89%] h-[80%] bg-[#ADEBC8]/67 rounded-4xl";
  const defaultStyle = "flex items-center w-[89%] h-[80%]";

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

      console.log('🔁 InstructorDashboard → redirect na session-complete');
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

  return (
    <div className="h-screen">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
        <div className="flex items-center bg-[#D9D9D9] w-5/12 rounded-3xl cursor-pointer">
          <img src="/images/search_icon.png" className="w-11 ml-2"></img>
          <p className="text-blue-dark/60 font-bold text-xl ml-1">
            Pretražite profile
          </p>
        </div>
        <button
          className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
          onClick={() => navigate("/profileInstructor")}
        >
          Profil
        </button>
      </div>

      {/* ===== Glavni sadržaj ===== */}
      <div className="flex h-5/6">
        {/* ===== Sidebar navigacija ===== */}
        <div className="flex justify-center w-1/5 bg-[#F8FFFC]">
          <div className="bg-green-light h-8/12 mt-22 w-11/12 rounded-2xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
            <ul className="h-full p-1">
              {/* ===== Termini tab ===== */}
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

              {/* ===== Video sesije tab ===== */}
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

              {/* ===== Kvizovi tab ===== */}
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

              {/* ===== Obavijesti tab ===== */}
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

        {/* ===== Sadržaj tabova ===== */}
        <div className="w-4/5">
          {selected == 1 && <Schedule />}
          {selected == 2 && <InstructorVideoSessions />}
          {selected == 3 && <p className="p-8 text-blue-dark text-2xl">Kvizovi - uskoro!</p>}
          {selected == 4 && <SessionSummaries userType="instructor" />}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;