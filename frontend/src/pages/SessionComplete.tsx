/* ================= SESSION COMPLETE PAGE ================= */
// Stranica za označavanje završetka video sesije i unos trajanja

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { completeVideoSession } from "../services/sessionService";

const SessionComplete = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [, setCurrentTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(0); // u minutama

  /* ================= DOHVAĆANJE START TIME IZ LOCALSTORAGE ================= */
  useEffect(() => {
    if (!sessionId) return;

    const storedStartTime = localStorage.getItem(`session_${sessionId}_start`);

    if (!storedStartTime) {
      console.warn("⚠️ Nema start time za ovu sesiju");
      // Ako nema start time, vrati korisnika na dashboard
      navigate("/dashboard");
      return;
    }

    const start = new Date(storedStartTime);
    setStartTime(start);

    // Automatski računanje trajanja
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();
    const durationMin = Math.round(durationMs / 1000 / 60);
    setDuration(durationMin);

    console.log(`⏱️ Session duration: ${durationMin} minutes`);
  }, [sessionId, navigate]);

  /* ================= LIVE TIMER ================= */
  useEffect(() => {
    if (!startTime) return;

    // Ažuriraj vrijeme svake sekunde
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const durationMs = now.getTime() - startTime.getTime();
      const durationMin = Math.round(durationMs / 1000 / 60);
      setDuration(durationMin);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  /* ================= POTVRDA ZAVRŠETKA SESIJE ================= */
  const handleConfirmComplete = async () => {
    // ===== Dozvoli završetak čak i za kratke sesije (debugging/testiranje) =====
    if (!sessionId) {
      alert("Greška: Sesija nije validna");
      return;
    }

    setLoading(true);

    try {
      // ===== API poziv za označavanje sesije kao završene =====
      await completeVideoSession(sessionId, duration);

      // ===== Očisti localStorage =====
      localStorage.removeItem(`session_${sessionId}_start`);
      localStorage.removeItem("active_session_id");
      localStorage.removeItem(`session_${sessionId}_status`);
      localStorage.removeItem("session_return_pending");

      console.log(`✅ Sesija ${sessionId} završena. Trajanje: ${duration} min`);

      // ===== Routing na dashboard =====
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Greška pri završavanju sesije:", error);
      alert("Greška pri spremanju podataka. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SESIJA JOŠ TRAJE ================= */
  const handleStillOngoing = () => {
    // Korisnik kaže da sesija još traje, vrati ga na dashboard BEZ redirecta
    if (!sessionId) return;

    // Spremi flag da ne redirecta automatski
    localStorage.setItem("session_return_pending", "false");

    navigate("/dashboard");
  };

  /* ================= FORMAT VREMENA ================= */
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* ===== Header ===== */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sesija završena
              </h1>
              <p className="text-sm text-gray-500">Molimo potvrdite detalje</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Glavni sadržaj ===== */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Info */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Je li sesija završena?
            </h2>
            <p className="text-gray-600">
              Automatski pratimo trajanje vaše sesije
            </p>
          </div>

          {/* Automatski izračunato trajanje */}
          <div className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Trajanje sesije</p>
              <div className="text-5xl font-bold text-purple-700 mb-2">
                {formatTime(duration)}
              </div>
              <p className="text-xs text-gray-500">
                ⏱️ Live timer - ažurira se svake sekunde
              </p>
            </div>
          </div>

          {/* Start time info */}
          <div className="mb-6 text-center text-sm text-gray-600">
            <p>
              Započeto:{" "}
              {startTime?.toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          {/* Statistika */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  Zašto je ovo važno?
                </h3>
                <p className="text-sm text-blue-800">
                  Ove informacije nam pomažu da poboljšamo kvalitetu usluge i
                  omogućavaju točnu naknadu instruktorima.
                </p>
              </div>
            </div>
          </div>

          {/* Akcije */}
          <div className="flex gap-4">
            <button
              onClick={handleStillOngoing}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Sesija još traje
            </button>
            <button
              onClick={handleConfirmComplete}
              disabled={loading || duration <= 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Spremanje..." : "Nastavi na recenziju →"}
            </button>
          </div>
        </div>

        {/* Session info */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow">
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-xl">💡</span>
            <p className="text-sm">
              Nakon što potvrdite, moći ćete ostaviti recenziju za instruktora
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComplete;
