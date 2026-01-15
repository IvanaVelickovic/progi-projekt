import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api";

interface BookingData {
  id: number;
  subject: string;
  format: string;
  instructorName: string;
  instructorId: number;
  dateTime: string;
  duration: number;
  price: number;
}

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();

  /* ================= BOOKING DATA ================= */
  const [bookingData, setBookingData] = useState<BookingData>({
    id: 1,
    subject: "Fizika",
    format: "uživo",
    instructorName: "Ivan Horvat",
    instructorId: 1,
    dateTime: "2025-12-27T16:00:00",
    duration: 120,
    price: 40,
  });

  /* ================= FETCH BOOKING DATA ================= */
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get(
          `/api/appointments/${appointmentId}`
        );
        setBookingData(response.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka o terminu:", error);
      }
    };

    if (appointmentId) {
      fetchBookingData();
    }
  }, [appointmentId]);

  /* ================= HANDLERS ================= */
  const handleCancel = () => {
    navigate("/student/search");
  };

  const handleContinue = async () => {
    try {
      const response = await api.post("/api/bookings/create", {
        appointmentId: bookingData?.id,
      });
      
      // Preusmjeravanje na plaćanje
      navigate(`/payment/${response.data.bookingId}`);
    } catch (error) {
      console.error("Greška pri kreiranju rezervacije:", error);
      alert("Došlo je do greške pri kreiranju rezervacije.");
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-[#7fc9b4] px-6 py-4">
        <h1 className="text-[#1e5a4a] text-xl">STEM tutorstvo</h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center px-4 pt-8 pb-12">
        <div className="w-full max-w-xl bg-white rounded-lg border-2 border-[#5a9b87] shadow-sm p-6">
          {/* TITLE */}
          <h2 className="text-[#2d5a4a] text-lg mb-6">Potvrđite rezervaciju</h2>

          {/* BOOKING DETAILS CARD */}
          <div className="bg-[#c5e8dd] rounded-lg p-6 mb-4">
            <h3 className="text-[#1e5a4a] mb-4">
              Termin - {bookingData.subject} ({bookingData.format})
            </h3>

            <div className="space-y-1 mb-4">
              <p className="text-[#2d5a4a] text-sm">
                <span className="font-medium">Instruktor:</span>{" "}
                {bookingData.instructorName}
              </p>
              <p className="text-[#2d5a4a] text-sm">
                <span className="font-medium">Datum i vrijeme održavanja:</span>{" "}
                {formatDateTime(bookingData.dateTime)}
              </p>
              <p className="text-[#2d5a4a] text-sm">
                <span className="font-medium">Trajanje:</span>{" "}
                {bookingData.duration}min
              </p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#a3d4c4] my-4"></div>

            {/* PRICE */}
            <div className="flex justify-between items-center">
              <span className="text-[#2d5a4a]">Ukupna cijena:</span>
              <span className="text-[#2d5a4a] text-xl">{bookingData.price}€</span>
            </div>
          </div>

          {/* WARNING MESSAGE */}
          <div className="bg-[#fef9e7] border border-[#f5e5a8] rounded-md px-4 py-3 mb-6">
            <p className="text-[#8b7a3a] text-sm">
              Molimo pažljivo provjerite detalje termina. Nakon potvrde, bit
              ćete odvedeni na plaćanje.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-white border-2 border-[#5a9b87] text-[#2d5a4a] py-3 px-6 rounded-md hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[#2d7a7a] text-white py-3 px-6 rounded-md hover:bg-[#255f5f] transition-colors"
            >
              Nastavite na plaćanje
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;