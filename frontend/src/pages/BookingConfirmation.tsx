import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useStudentAppointments } from "../context/StudentSearchContext";
import type { Appointment } from "../context/StudentSearchContext";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const parsedId = parseInt(id ?? "0");

  const { appointments } = useStudentAppointments();
  const [appointment, setAppointment] = useState<Appointment>();

  useEffect(() => {
    setAppointment(appointments.find((a) => a.id === parsedId));
  }, [id]);

  const handleCancel = () => {
    navigate("/schedules/search");
  };

  const handleContinue = () => {
    // Preusmjeravanje na plaćanje
    navigate(`/payment/${appointment?.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 max-h-[110px] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex items-start justify-center px-4 pt-8 pb-12 text-blue-dark">
        <div className="w-full max-w-xl bg-white rounded-lg border-2 border-[#5a9b87] shadow-sm p-7 py-8">
          {/* TITLE */}
          <h2 className=" text-xl mb-6 font-medium">Potvrdite rezervaciju</h2>

          {/* BOOKING DETAILS CARD */}
          <div className="bg-[#c5e8dd] rounded-lg p-6 mb-4">
            <h3 className=" mb-4 text-lg font-medium">
              Termin - {appointment?.subject} ({appointment?.format})
            </h3>

            <div className="space-y-1 mb-4">
              <p className=" text-md">
                <span className="font-medium">Instruktor:</span>{" "}
                {appointment?.instructorName}
              </p>
              <p className=" text-md">
                <span className="font-medium">Datum i vrijeme održavanja:</span>{" "}
                {appointment?.dateTime.split("T")[0]}{" "}
                {appointment?.dateTime.split("T")[1]}
              </p>
              <p className=" text-md">
                <span className="font-medium">Trajanje:</span>{" "}
                {appointment?.duration}min
              </p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#a3d4c4] my-4"></div>

            {/* PRICE */}
            <div className="flex justify-between items-center">
              <span className="">Ukupna cijena:</span>
              <span className="] text-xl">{appointment?.price}€</span>
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
              className="flex-1 bg-white border-2 border-blue-light text-[#2d5a4a] py-3 px-6 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Odustani
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-blue-light text-white py-3 px-6 rounded-md hover:bg-blue-dark cursor-pointer transition-colors"
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
