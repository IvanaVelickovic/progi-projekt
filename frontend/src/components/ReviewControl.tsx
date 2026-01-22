import { useEffect, useState } from "react";
import api from "../api";
//import reviewsData from "../assets/reviews.json";

interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  studentName: string;
  studentLastName: string;
  instructorName: string;
  instructorLastName: string;
  removed: boolean;
}

const ReviewControl = () => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [viewType, setViewType] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/api/admin/reviews");
        if (res.data.length) {
          setAllReviews(res.data);
        }
      } catch (error) {
        console.error();
      }
    };
    fetchReviews();
    //setAllReviews(reviewsData);
  }, []);

  const filteredReviews = allReviews.filter((r) => {
    if (viewType === 1) return !r.removed; // otkrivene
    if (viewType === 2) return r.removed; // sakrivene
    return true; // sve
  });

  const toggleHidden = async (reviewId: number) => {
    setAllReviews((prevReviews) =>
      prevReviews.map((prev) =>
        prev.reviewId === reviewId ? { ...prev, removed: !prev.removed } : prev,
      ),
    );
    try {
      await api.put(`/api/admin/reviews/${reviewId}/toggle`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    const proceed = window.confirm(
      "Jeste li sigurni da želite obrisati recenziju? Brisanje je trajno i neće se moći poništiti. Ako ju želite ukloniti samo privremeno, koristite opciju 'Sakrij'",
    );

    if (proceed) {
      setAllReviews((prevReviews) =>
        prevReviews.filter((prev) => prev.reviewId !== reviewId),
      );
      try {
        await api.delete(`/api/admin/reviews/${reviewId}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center p-5">
        <div className="">
          <div className="text-2xl text-blue-dark font-bold">Sve recenzije</div>
          <div className="text-blue-dark/80">
            Ukupno {filteredReviews.length} recenzija
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className={
              viewType === 0
                ? "bg-blue-dark/90 text-white px-5 py-1 rounded-lg cursor-pointer"
                : "bg-white border-2 border-blue-dark  px-5 py-1 rounded-lg cursor-pointer"
            }
            onClick={() => setViewType(0)}
          >
            Sve
          </button>
          <button
            className={
              viewType === 1
                ? "bg-blue-dark/90 text-white px-5 py-1 rounded-lg cursor-pointer"
                : "bg-white border-2 border-blue-dark  px-5 py-1 rounded-lg cursor-pointer"
            }
            onClick={() => setViewType(1)}
          >
            Otkrivene
          </button>
          <button
            className={
              viewType === 2
                ? "bg-blue-dark/90 text-white px-5 py-1 rounded-lg cursor-pointer"
                : "bg-white border-2 border-blue-dark  px-5 py-1 rounded-lg cursor-pointer"
            }
            onClick={() => setViewType(2)}
          >
            Sakrivene
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {filteredReviews?.map((item) => (
          <div
            key={item.reviewId}
            className={
              !item.removed
                ? "bg-white rounded-2xl border-2 text-blue-dark border-[#2B7A78] p-5 hover:shadow-lg transition-shadow mx-6"
                : "bg-white rounded-2xl border-2 text-blue-dark border-[#2B7A78] p-5 hover:shadow-lg transition-shadow mx-6 opacity-50"
            }
          >
            <div className="flex justify-between items-center p-2">
              <div className="flex w-full">
                <div className=" w-[95%]">
                  <div className="flex gap-5">
                    <h3 className=" text-xl font-semibold pt-1">
                      Instruktor: {item.instructorName}{" "}
                      {item.instructorLastName}
                    </h3>
                    <div className="flex justify-center items-start">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`text-2xl  ${
                            star <= item.rating
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }
                        }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className=" text-md">
                    Recenziju ostavio/la: {item.studentName}{" "}
                    {item.studentLastName}
                  </p>
                  <div className=" border-blue-dark/50 rounded-lg p-3 mb-2 bg-green-light/50 w-full">
                    {item.comment}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className={
                    !item.removed
                      ? "w-40 px-3 py-2 border-2 border-[#2B7A78] text-[#2B7A78] rounded-lg hover:bg-[#D5F4E6] transition-colors text-sm font-bold cursor-pointer"
                      : " bg-[#2B7A78]/10 w-40 px-3 py-2 border-2 border-[#2B7A78] text-[#2B7A78] rounded-lg hover:bg-[#D5F4E6] transition-colors text-sm font-bold cursor-pointer"
                  }
                  onClick={() => toggleHidden(item.reviewId)}
                >
                  {!item.removed ? "Sakrij" : "Otkrij"}
                </button>
                <button
                  className="w-40 flex items-center justify-center gap-2 px-3 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold cursor-pointer"
                  onClick={() => handleDelete(item.reviewId)}
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewControl;
