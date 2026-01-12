import { useState } from "react";

const ReviewInstructor = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  return (
    <div className="min-h-screen bg-[#e9f7f1] flex flex-col">
      {/* HEADER */}
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

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-[#dff3ea] rounded-2xl shadow-lg p-10">
          <h2 className="text-xl font-semibold text-[#0b3b2e] mb-6">
            Ime Prezime
          </h2>

          {/* ZVJEZDICE */}
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

          {/* RECENZIJA */}
          <div className="flex justify-center mb-6">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Napišite svoju recenziju instruktora..."
              className="w-full max-w-2xl h-40 p-4 rounded-xl border border-gray-300 outline-none resize-none text-base"
            />
          </div>

          {/* GUMB */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                console.log("Ocjena:", rating);
                console.log("Recenzija:", reviewText);
              }}
              className="bg-[#0b3b2e] text-white px-10 py-3 rounded-xl font-medium"
            >
              Pošalji recenziju
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewInstructor;
