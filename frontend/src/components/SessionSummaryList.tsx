import type { SessionSummary } from "../services/sessionSummaryService";

interface Props {
  summaries: SessionSummary[];
}

const SessionSummaryList = ({ summaries }: Props) => {
  if (summaries.length === 0) {
    return <p className="text-gray-500">Nema novih obavijesti</p>;
  }

  return (
    <div className="space-y-4">
      {summaries.map((s) => (
        <div
          key={s.summaryId}
          className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-600"
        >
          <h3 className="font-semibold text-gray-800">
            🎥 {s.subject}
          </h3>

          <p className="text-sm text-gray-600">
            {s.role === "student"
              ? `Instruktor: ${s.instructorName}`
              : `Studenti: ${s.studentNames.join(", ")}`}
          </p>

          <p className="text-sm text-gray-600">
            ⏱ Trajanje: {s.durationMin} min
          </p>

          <p className="text-xs text-gray-400">{s.date}</p>
        </div>
      ))}
    </div>
  );
};

export default SessionSummaryList;
