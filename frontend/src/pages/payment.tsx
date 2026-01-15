import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api";

interface BookingData {
  id: number;
  subject: string;
  format: string;
  instructorName: string;
  dateTime: string;
  price: number;
  serviceFee: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();

  /* ================= BOOKING DATA ================= */
  const [bookingData, setBookingData] = useState<BookingData>({
    id: 1,
    subject: "Fizika",
    format: "uživo",
    instructorName: "Ivan Horvat",
    dateTime: "2025-12-27T16:00:00",
    price: 40,
    serviceFee: 5,
  });

  /* ================= PAYMENT FORM DATA ================= */
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvc: "",
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/student/search");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mockup - direktno preusmjeri na success stranicu
    navigate(`/payment-success/`);
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

  const totalPrice = bookingData.price + bookingData.serviceFee;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#e8f5f0]">
      {/* HEADER */}
      <header className="bg-[#7fc9b4] px-6 py-4">
        <h1 className="text-[#1e5a4a] text-xl">STEM tutorstvo</h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center gap-6 px-4 pt-8 pb-12">
        {/* PAYMENT FORM */}
        <div className="w-full max-w-md bg-[#d4f0e6] rounded-lg border-2 border-[#5a9b87] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-6 h-6 text-[#2d5a4a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
              <path d="M2 10h20" strokeWidth="2" />
            </svg>
            <h2 className="text-[#2d5a4a] text-lg">Podaci o kartici</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* CARD NUMBER */}
            <div className="mb-4">
              <label
                htmlFor="cardNumber"
                className="block text-[#2d5a4a] text-sm mb-1"
              >
                Broj kartice
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="1234 4567 8901 2345"
                className="w-full px-3 py-2 bg-white border border-[#5a9b87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d7a7a]"
                required
              />
            </div>

            {/* CARD HOLDER */}
            <div className="mb-4">
              <label
                htmlFor="cardHolder"
                className="block text-[#2d5a4a] text-sm mb-1"
              >
                Ime vlasnika kartice
              </label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleChange}
                placeholder="Ivan Horvat"
                className="w-full px-3 py-2 bg-white border border-[#5a9b87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d7a7a]"
                required
              />
            </div>

            {/* EXPIRY DATE AND CVC */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label
                  htmlFor="expiryDate"
                  className="block text-[#2d5a4a] text-sm mb-1"
                >
                  Datum isteka
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 bg-white border border-[#5a9b87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d7a7a]"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="cvc"
                  className="block text-[#2d5a4a] text-sm mb-1"
                >
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={paymentData.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full px-3 py-2 bg-white border border-[#5a9b87] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d7a7a]"
                  required
                />
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#a3d4c4] mb-6"></div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-white border-2 border-[#5a9b87] text-[#2d5a4a] py-2 px-6 rounded-md hover:bg-gray-50 transition-colors"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#2d7a7a] text-white py-2 px-6 rounded-md hover:bg-[#255f5f] transition-colors"
              >
                Plati
              </button>
            </div>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full max-w-xs bg-white rounded-lg border-2 border-[#5a9b87] shadow-sm p-6">
          <h3 className="text-[#2d5a4a] mb-4">Sažetak narudžbe</h3>

          <div className="mb-4">
            <p className="text-[#1e5a4a] text-sm mb-2">
              Termin - {bookingData.subject} ({bookingData.format})
            </p>
            <p className="text-[#2d5a4a] text-sm">
              Instruktor: {bookingData.instructorName}
            </p>
            <p className="text-[#2d5a4a] text-sm">
              {formatDateTime(bookingData.dateTime)}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[#2d5a4a] text-sm">
              <span>Cijena termina</span>
              <span>{bookingData.price}€</span>
            </div>
            <div className="flex justify-between text-[#2d5a4a] text-sm">
              <span>Naknada za uslugu</span>
              <span>{bookingData.serviceFee}€</span>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-[#a3d4c4] my-4"></div>

          {/* TOTAL */}
          <div className="flex justify-between items-center">
            <span className="text-[#2d5a4a]">Ukupno</span>
            <span className="text-[#2d5a4a] text-xl">{totalPrice}€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;