import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api";

interface BookingData {
  id: number;
  subject: string;
  format: string;
  instructorName: string;
  dateTime: string;
  duration: number;
  totalPaid: number;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();

  /* ================= BOOKING DATA ================= */
  const [bookingData, setBookingData] = useState<BookingData>({
    id: 1,
    subject: "Fizika",
    format: "uživo",
    instructorName: "Ivan Horvat",
    dateTime: "2025-12-27T16:00:00",
    duration: 120,
    totalPaid: 45,
  });

  /* ================= FETCH BOOKING DATA ================= */
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get(`/api/bookings/${bookingId}`);
        setBookingData(response.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka o rezervaciji:", error);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  /* ================= HANDLERS ================= */
  const handleBackToDashboard = () => {
    navigate("/student/dashboard");
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f0f4f2]">
      {/* HEADER */}
      <header className="bg-[#7fc9b4] px-6 py-4">
        <h1 className="text-[#1e5a4a] text-xl">STEM tutorstvo</h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center px-4 pt-12 pb-12">
        <div className="w-full max-w-md bg-[#e8f5f0] rounded-lg border-2 border-[#5a9b87] shadow-sm p-8">
          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-[#5a9b87] rounded-lg flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2L11.5 7.5L17 9L11.5 10.5L10 16L8.5 10.5L3 9L8.5 7.5L10 2Z"
                    fill="#5a9b87"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -left-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2L9 6L13 7L9 8L8 12L7 8L3 7L7 6L8 2Z"
                    fill="#5a9b87"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          <div className="text-center mb-6">
            <h2 className="text-[#2d5a4a] text-xl mb-2">
              Uspješno plaćanje!
            </h2>
            <p className="text-[#2d5a4a] text-sm">
              Vaša rezervacija je potvrđena.
            </p>
          </div>

          {/* BOOKING DETAILS */}
          <div className="bg-[#c5e8dd] rounded-lg p-5 mb-4">
            <h3 className="text-[#1e5a4a] mb-3">
              Detalji rezervacije
            </h3>

            <div className="mb-3">
              <p className="text-[#1e5a4a] text-sm mb-1">
                Termin - {bookingData.subject} ({bookingData.format})
              </p>
              <p className="text-[#2d5a4a] text-sm">
                Instruktor: {bookingData.instructorName}
              </p>
              <p className="text-[#2d5a4a] text-sm">
                Datum i vrijeme održavanja: {formatDateTime(bookingData.dateTime)}
              </p>
              <p className="text-[#2d5a4a] text-sm">
                Trajanje: {bookingData.duration}min
              </p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#a3d4c4] my-3"></div>

            {/* TOTAL PAID */}
            <div className="flex justify-between items-center">
              <span className="text-[#2d5a4a]">Ukupno plaćeno:</span>
              <span className="text-[#2d5a4a] text-lg">
                {bookingData.totalPaid}€
              </span>
            </div>
          </div>

          {/* BACK TO DASHBOARD BUTTON */}
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-[#2d7a7a] text-white py-3 px-6 rounded-md hover:bg-[#255f5f] transition-colors"
          >
            Povratak na Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;