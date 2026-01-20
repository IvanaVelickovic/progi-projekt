/* ================= STUDENT ONLINE SESSIONS COMPONENT ================= */
// Komponenta za prikaz online video sesija studenta

import type { VideoSession } from "../services/sessionService";

interface StudentOnlineSessionsProps {
  sessions: VideoSession[];
}

const StudentOnlineSessions = ({ sessions }: StudentOnlineSessionsProps) => {
  /* ================= HELPER FUNCTIONS ================= */
  // ===== Direktan ulazak u Jitsi Meet =====
  const handleJoinSession = (sessionId: number, studentName: string) => {
    // ===== Spremanje start time u localStorage =====
    const startTime = new Date().toISOString();
    localStorage.setItem(`session_${sessionId}_start`, startTime);
    localStorage.setItem('active_session_id', sessionId.toString());
    localStorage.setItem(`session_${sessionId}_status`, 'in_progress');
    localStorage.setItem('session_return_pending', 'true'); // 🔑 KLJUČNO za redirect
    
    console.log(`🟢 Session ${sessionId} started at ${startTime}`);
    
    const roomName = `STEMTutoring-Session-${sessionId}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName=${encodeURIComponent(studentName)}`;
    
    window.open(jitsiUrl, '_blank');
  };

  const getStatusBadge = (session: VideoSession) => {
    if (session.status === "live") {
      return (
        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
          🔴 UŽIVO
        </span>
      );
    }
    
    if (session.status === "completed") {
      return (
        <span className="bg-gray-400 text-white px-4 py-2 rounded-full text-sm">
          Završeno
        </span>
      );
    }
    
    return (
      <span className="bg-blue-light text-white px-4 py-2 rounded-full text-sm">
        Nadolazeće
      </span>
    );
  };

  /* ================= VALIDACIJA ================= */
  // Osiguraj da je sessions uvijek niz
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  /* ================= RENDER ================= */
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">📹</span>
        <h2 className="text-blue-dark text-3xl font-bold">
          Online video sesije
        </h2>
      </div>

      <div className="space-y-4">
        {safeSessions.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl opacity-30">📹</span>
            <p className="text-blue-dark/60 text-xl mt-4">
              Nemate zakazanih online sesija.
            </p>
          </div>
        ) : (
          safeSessions.map((session) => {
            const isLive = session.status === "live";

            return (
              <div
                key={session.id}
                className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-all ${
                  isLive
                    ? "bg-red-50 border-2 border-red-500"
                    : "bg-green-light/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-blue-dark text-2xl font-bold">
                        {session.subject}
                      </h3>
                      {getStatusBadge(session)}
                    </div>
                    
                    <p className="text-blue-dark/80 text-lg mb-2">
                      Instruktor: {session.studentName}
                    </p>
                    <p className="text-blue-dark/70 mb-1">
                      📅 {session.date} u{" "}
                      {session.time}
                    </p>
                    <p className="text-blue-dark/70 mb-1">
                      ⏱️ Trajanje: {session.duration} min
                    </p>
                    <p className="text-blue-dark/70">
                      💻 Online video poziv
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => handleJoinSession(session.id, "Student")}
                      className={`px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center gap-2 w-full mb-2 justify-center ${
                        isLive
                          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                          : "bg-blue-light hover:bg-blue-dark text-white"
                      }`}
                    >
                      <span className="text-xl">📹</span>
                      {isLive ? "Uđi sada" : "Uđi u sesiju"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentOnlineSessions;