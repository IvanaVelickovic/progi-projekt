import type { SessionSummary } from "../services/sessionSummaryService";

interface Props {
  summaries: SessionSummary[];
}
const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);

  return d.toLocaleString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SessionSummaryList = ({ summaries }: Props) => {
  if (summaries.length === 0) {
    return <p className="text-gray-500">Nema novih obavijesti</p>;
  }

  return (
    <div className="space-y-4">
      {summaries.map((s) => (
        <div
          key={s.summaryId}
          className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-light"
        >
          <h3 className="font-semibold text-blue-dark">🎥 {s.subject}</h3>

          <p className="text-sm text-blue-dark/90">
            {s.role === "student"
              ? `Instruktor: ${s.instructorName}`
              : `Studenti: ${s.studentNames.join(", ")}`}
          </p>

          <p className="text-sm text-blue-dark/90">
            ⏱ Trajanje: {s.durationMin} min
          </p>

          <p className="text-xs text-blue-dark/80">📅 {formatDate(s.date)}</p>
        </div>
      ))}
    </div>
  );
};

export default SessionSummaryList;
