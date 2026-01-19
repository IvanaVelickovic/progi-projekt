import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useStudentAppointments,
  type Appointment,
} from "../context/StudentSearchContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const parsedId = parseInt(id ?? "0");

  const { appointments } = useStudentAppointments();
  const [appointment, setAppointment] = useState<Appointment>();

  useEffect(() => {
    setAppointment(appointments.find((a) => a.id === parsedId));
  }, [id]);

  const handleBackToDashboard = () => {
    navigate("/student/dashboard");
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
      <div className="flex items-start justify-center px-4 pt-8 pb-12 text-blue-dark">
        <div className="w-full max-w-md bg-[#e8f5f0] rounded-lg border-2 border-[#5a9b87] shadow-sm p-8">
          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <img src="/images/quiz_completed.png"></img>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          <div className="text-center mb-6">
            <h2 className=" text-2xl mb-2">Uspješno plaćanje!</h2>
            <p className=" text-md">Vaša rezervacija je potvrđena.</p>
          </div>

          {/* BOOKING DETAILS */}
          <div className="bg-[#c5e8dd] rounded-lg p-5 mb-4">
            <h3 className="text-lg mb-3">Detalji rezervacije</h3>

            <div className="mb-3">
              <p className=" text-md mb-1">
                Termin - {appointment?.subject} ({appointment?.format})
              </p>
              <p className=" text-md">
                Instruktor: {appointment?.instructorName}
              </p>
              <p className=" text-md">
                Datum i vrijeme održavanja:{" "}
                {appointment?.dateTime.split("T")[0]}{" "}
                {appointment?.dateTime.split("T")[1]}
              </p>
              <p className=" text-md">Trajanje: {appointment?.duration}min</p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#a3d4c4] my-3"></div>

            {/* TOTAL PAID */}
            <div className="flex justify-between items-center">
              <span className="">Ukupno plaćeno:</span>
              <span className=" text-lg">{(appointment?.price ?? 0) + 5}€</span>
            </div>
          </div>

          {/* BACK TO DASHBOARD BUTTON */}
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-blue-light text-white mt-2 py-3 px-6 rounded-md hover:bg-blue-dark transition-colors cursor-pointer"
          >
            Povratak na Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
