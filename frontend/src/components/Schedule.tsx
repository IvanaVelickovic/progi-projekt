import Calendar from "react-calendar";
//import appointmentsData from "../assets/appointments.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAppointments } from "../context/AppointmentsContext";
import EditSchedule from "./EditSchedule";

export interface Appointment {
  scheduleId: number;
  datetime: string;
  attendanceMode: string;
  durationMin: number;
  price: number;
  filled: number;
  maxParticipants: number;
  googleCalendar: boolean;
  subject: string;
}

const Schedule = () => {
  const [editSchedule, setEditSchedule] = useState(false);
  const navigate = useNavigate();

  const { appointments, setAppointments } = useAppointments();

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const [googleUser, setGoogleUser] = useState(false);

  let [scheduleData, setScheduleData] = useState({
    scheduleId: -1,
    index: -1,
    filled: -1,
    googleUser: false,
    googleCalendar: false,
  });

  const goToEditSchedule = (
    scheduleId: number,
    index: number,
    filled: number,
    googleUser: boolean,
    googleCalendar: boolean,
  ) => {
    console.log(appointments);
    setScheduleData({
      scheduleId: scheduleId,
      index: index,
      filled: filled,
      googleUser: googleUser,
      googleCalendar: googleCalendar,
    });

    setEditSchedule(true);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // 1. Sync with a Google status endpoint (optional check)
        // If you don't have this on back yet, you can comment it out
        try {
          const userRes = await api.get("/api/google/status");
          setGoogleUser(userRes.data);
        } catch (e) {
          console.log("Google sync check skipped");
        }

        // 2. THIS IS THE IMPORTANT CHANGE:
        // Calling the specific instructor schedule endpoint
        const dataRes = await api.get(
          "/api/instructor-schedules/my-appointments",
        );
        setAppointments(dataRes.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    };

    fetchAppointments();
    //setAppointments(appointmentsData);
  }, []);

  const appointmentDates = safeAppointments.map(
    (item) => item.datetime?.split("T")[0] || "",
  );

  return (
    <div className="flex h-full">
      <div className="w-3/4 p-5 flex flex-col">
        <h1 className="text-blue-dark text-3xl font-bold">Moji termini</h1>
        <div className="flex flex-col items-center mt-5 overflow-y-scroll">
          {safeAppointments.length !== 0 ? (
            safeAppointments.map((item, index) => (
              <div
                key={item.scheduleId}
                id={item.datetime?.split("T")[0] || "No Date"}
                className="flex justify-between bg-[#ADEBC8] border-2 border-blue-dark rounded-2xl w-full px-0.5 h-[250px] mb-6 shrink-0 drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]"
              >
                <div className="w-7/12 p-5">
                  <h1 className="text-blue-dark text-2xl font-bold">
                    Termin {index + 1} - {item.subject}
                  </h1>
                  <div className="p-5 pt-7 text-blue-dark font-semibold text-xl">
                    <div className="flex justify-between ">
                      <span>• Održavanje</span>
                      <span>
                        {item.attendanceMode === "in_person"
                          ? "uživo"
                          : "online"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Trajanje</span>
                      <span>{item.durationMin} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Cijena po terminu:</span>
                      <span>{item.price} €</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between w-4/12">
                  <div className="w-9/12 p-4 m-3 bg-white rounded-2xl text-lg text-blue-dark font-semibold text-center">
                    {item.datetime?.split("T")[0] || "No Date"}
                    <br></br>
                    {item.datetime?.split("T")[1] || "No Time"}
                  </div>
                  <div className="flex flex-col m-3 p-2 w-11/12 items-end">
                    <div className="bg-[#D9D9D9] p-3 rounded-3xl text-lg text-blue-dark font-semibold text-center px-6">
                      Popunjenost:{" "}
                      {item.filled === undefined ? "0" : item.filled}/
                      {item.maxParticipants}
                    </div>
                    <button
                      className="bg-blue-light text-white text-lg p-2 rounded-3xl text-center w-8/12 cursor-pointer mt-1.5"
                      onClick={() =>
                        goToEditSchedule(
                          item.scheduleId,
                          index + 1,
                          item.filled,
                          googleUser,
                          item.googleCalendar,
                        )
                      }
                    >
                      Uredi
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="self-start ml-4 text-blue-dark text-xl">
              Nema termina.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-between w-1/4 pt-2 pb-8">
        <Calendar
          className="bg-white p-1 w-full"
          tileClassName={({ date }) => {
            const formatted = date.toLocaleDateString("sv-SE");
            return appointmentDates.includes(formatted)
              ? "has-appointment"
              : null;
          }}
          onClickDay={(value) => {
            const formatted = value.toLocaleDateString("sv-SE");
            const el = document.getElementById(formatted);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        ></Calendar>
        <button
          className="bg-blue-light text-white text-xl p-3 rounded-2xl text-center w-10/12 cursor-pointer mt-1.5"
          onClick={() => navigate("/instructor/addSchedule")}
        >
          Dodaj novi termin
        </button>
      </div>
      {editSchedule && (
        <EditSchedule
          scheduleData={scheduleData}
          setEditSchedule={setEditSchedule}
        />
      )}
    </div>
  );
};

export default Schedule;
