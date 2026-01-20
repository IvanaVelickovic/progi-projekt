/* ================= SESSION SUMMARIES COMPONENT ================= */
// Komponenta za prikaz završenih video sesija (session summary)

import { useEffect, useState } from "react";
import { getStudentSessionSummaries, getInstructorSessionSummaries } from "../services/sessionService";

// ===== TIP ZA SESSION SUMMARY =====
interface SessionSummary {
  id: number;
  instructorName?: string; // Opciono - samo za studente
  studentName?: string; // Opciono - samo za instruktore
  subject: string;
  date: string;
  duration: number; // u minutama
  status: "pending_review" | "completed";
}

// ===== PROPS =====
interface SessionSummariesProps {
  userType: "student" | "instructor";
}

// ===== GLAVNA KOMPONENTA =====
const SessionSummaries = ({ userType }: SessionSummariesProps) => {
  const [summaries, setSummaries] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= DOHVAĆANJE PODATAKA ================= */
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const data =
          userType === "student"
            ? await getStudentSessionSummaries()
            : await getInstructorSessionSummaries();

        if (Array.isArray(data)) {
          setSummaries(data);
        } else {
          console.warn("Service nije vratio ispravan format");
          setSummaries([]);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju session summaries:", error);
        setSummaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();

    // ===== LISTENER ZA WINDOW FOCUS - osvježi kad se korisnik vrati =====
    const handleFocus = () => {
      console.log("👁️ SessionSummaries: Window focus - osvježavam podatke");
      fetchSummaries();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [userType]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  /* ================= PRAZAN STATE ================= */
  if (summaries.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center bg-gray-50 rounded-xl p-8 max-w-md">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Nema završenih sesija
          </h3>
          <p className="text-gray-600">
            Ovdje će se prikazati sve vaše završene video sesije
          </p>
        </div>
      </div>
    );
  }

  /* ================= RENDER LISTE ================= */
  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-dark mb-2">
          📊 Završene sesije
        </h2>
        <p className="text-gray-600">
          Pregled svih vaših završenih video sesija
        </p>
      </div>

      <div className="space-y-4">
        {summaries.map((summary) => (
          <SessionSummaryCard
            key={summary.id}
            summary={summary}
            userType={userType}
          />
        ))}
      </div>
    </div>
  );
};

/* ================= SESSION SUMMARY CARD ================= */
interface SessionSummaryCardProps {
  summary: SessionSummary;
  userType: "student" | "instructor";
}

const SessionSummaryCard = ({
  summary,
  userType,
}: SessionSummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500">
      <div className="flex items-start justify-between">
        {/* Lijeva strana - Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {summary.subject}
              </h3>
              <p className="text-sm text-gray-500">
                {userType === "student" ? (
                  <>Instruktor: {summary.instructorName}</>
                ) : (
                  <>Student: {summary.studentName}</>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-gray-500 text-xs">Datum</p>
                <p className="font-medium text-gray-900">{summary.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="text-gray-500 text-xs">Trajanje</p>
                <p className="font-medium text-gray-900">
                  {summary.duration} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desna strana - Status */}
        <div className="ml-4">
          {summary.status === "pending_review" ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              ⏳ Čeka recenziju
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              ✅ Završeno
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionSummaries;