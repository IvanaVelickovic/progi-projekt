import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useStudentAppointments } from "../context/StudentSearchContext";
import type { Appointment } from "../context/StudentSearchContext";
import api from "../api";

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const parsedId = parseInt(id ?? "0");

  const { appointments } = useStudentAppointments();
  const [appointment, setAppointment] = useState<Appointment>();

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvc: "",
  });

  useEffect(() => {
    setAppointment(appointments.find((a) => a.id === parsedId));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/schedule/search");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/student/reservation", {
        params: { schedule_id: parsedId },
      });
      navigate(`/payment-success/${parsedId}`);
    } catch (error) {
      console.error(error);
      window.alert(
        "Rezervacija nije uspjela. Pokušajte ponovno za nekoliko minuta.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 max-h-[110px] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center gap-6 px-4 pt-8 pb-12 text-blue-dark">
        {/* PAYMENT FORM */}
        <div className="w-full max-w-md bg-[#d4f0e6] rounded-lg border-2 border-[#5a9b87] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-6 h-6 text-blue-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
              <path d="M2 10h20" strokeWidth="2" />
            </svg>
            <h2 className="text-blue-dark text-xl">Podaci o kartici</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* CARD NUMBER */}
            <div className="mb-4">
              <label
                htmlFor="cardNumber"
                className="block text-blue-dark text-md mb-1"
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
                className="block text-blue-dark text-md mb-1"
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
                  className="block text-blue-dark text-md mb-1"
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
                  className="block text-blue-dark text-md mb-1"
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
                className="flex-1 bg-white border-2 border-blue-light text-blue-dark  py-2 px-6 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-light text-white py-2 px-6 rounded-md hover:bg-blue-dark transition-colors cursor-pointer"
              >
                Plati
              </button>
            </div>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full max-w-xs bg-white rounded-lg border-2 border-[#5a9b87] shadow-sm p-6">
          <h3 className="text-blue-dark mb-4 text-xl">Sažetak narudžbe</h3>

          <div className="mb-4">
            <p className="text-blue-dark text-md mb-2">
              Termin - {appointment?.subject} ({appointment?.format})
            </p>
            <p className="text-blue-dark text-md">
              Instruktor: {appointment?.instructorName}
            </p>
            <p className="text-blue-dark text-md">
              {appointment?.dateTime.split("T")[0]}{" "}
              {appointment?.dateTime.split("T")[1]}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-blue-dark text-md">
              <span>Cijena termina</span>
              <span>{appointment?.price}€</span>
            </div>
            <div className="flex justify-between text-blue-dark text-md">
              <span>Naknada za uslugu</span>
              <span>5€</span>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-[#a3d4c4] my-4"></div>

          {/* TOTAL */}
          <div className="flex justify-between items-center">
            <span className="text-blue-dark">Ukupno</span>
            <span className="text-blue-dark text-xl">
              {(appointment?.price ?? 0) + 5}€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
