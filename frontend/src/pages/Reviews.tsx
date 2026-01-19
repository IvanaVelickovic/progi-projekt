import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

const Review = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const instructorId = searchParams.get("instructorId");
  const participationId = searchParams.get("participationId");

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const [instructorData, setInstructorData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!instructorId) return;
      try {
        const res = await api.get(`/api/instructors/${instructorId}`);
        setInstructorData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
        });
      } catch (error) {
        console.error("Greška pri dohvaćanju instruktora:", error);
      }
    };

    fetchInstructor();
  }, [instructorId]);

  const sendReview = async () => {
    if (!participationId) {
      alert("Nedostaje ID termina!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/reviews", {
        reservationParticipationId: Number(participationId),
        rating: rating,
        comment: reviewText,
      });

      alert("Recenzija poslana! Hvala vam.");
      navigate("/student/dashboard");
    } catch (error: any) {
      const errorMsg = error.response?.data || "Greška pri slanju recenzije.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9f7f1] flex flex-col">
      <header className="bg-[#9bd7b6] px-8 py-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold text-[#0b3b2e] cursor-pointer"
          onClick={() => navigate("/")}
        >
          STEM tutorstvo
        </h1>
        <button
          className="bg-[#0b3b2e] text-white px-6 py-2 rounded-lg"
          onClick={() => navigate("/profile")}
        >
          Profil
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-[#dff3ea] rounded-2xl shadow-lg p-10">
          <h2 className="text-2xl font-semibold text-[#0b3b2e] mb-2 text-center">
            Kako vam se svidjela instrukcija?
          </h2>
          <p className="text-center text-[#0b3b2e] mb-6 opacity-80">
            Instruktor: {instructorData.firstName} {instructorData.lastName}
          </p>

          {/* Zvjezdice */}
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-5xl transition-transform hover:scale-110 ${
                  star <= rating ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ovdje napišite svoje dojmove o instruktoru i kvaliteti nastave..."
              className="w-full max-w-2xl h-40 p-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#9bd7b6] text-base"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={sendReview}
              disabled={!rating || !reviewText || loading}
              className="bg-[#0b3b2e] text-white px-10 py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-[#082d23] transition-colors"
            >
              {loading ? "Slanje..." : "Pošalji recenziju"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Review;
