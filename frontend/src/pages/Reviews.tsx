import { useState, useEffect } from "react";
import api from "../api";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // State za instruktora (isto kao u ProfileEditInstructor)
  const [InstructorData, setInstructorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Dohvati podatke instruktora
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const res = await api.get("/api/Instructor/profile");
        setInstructorData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
        });
      } catch (error) {
        console.error("Greška pri dohvaćanju instruktora:", error);
      }
    };

    fetchInstructor();
  }, []);

  // Slanje recenzije
  const sendReview = async () => {
    try {
      await api.post("/api/reviews", {
        // backend može prepoznati instruktora preko tokena, pa id nije potreban
        rating,
        text: reviewText,
      });

      console.log("Recenzija poslana!");
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Greška pri slanju recenzije:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9f7f1] flex flex-col">
      <header className="bg-[#9bd7b6] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0b3b2e]">STEM tutorstvo</h1>
        <div className="bg-[#e9f7f1] px-4 py-2 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Pretražite profile"
            className="bg-transparent outline-none text-sm w-[280px]"
          />
        </div>
        <button className="bg-[#0b3b2e] text-white px-6 py-2 rounded-lg">
          Profil
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-[#dff3ea] rounded-2xl shadow-lg p-10">
          <h2 className="text-xl font-semibold text-[#0b3b2e] mb-6">
            {InstructorData.firstName || InstructorData.lastName
              ? `${InstructorData.firstName} ${InstructorData.lastName}`
              : "Učitavanje..."}
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl ${
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
              placeholder="Napišite svoju recenziju instruktora..."
              className="w-full max-w-2xl h-40 p-4 rounded-xl border border-gray-300 outline-none resize-none text-base"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={sendReview}
              disabled={!rating || !reviewText}
              className="bg-[#0b3b2e] text-white px-10 py-3 rounded-xl font-medium disabled:opacity-50"
            >
              Pošalji recenziju
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Review;
