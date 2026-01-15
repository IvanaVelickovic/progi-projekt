import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSchedule from "../components/StudentSchedule";
//import appointmentsData from "../assets/appointments.json";
import api from "../api";

interface Appointment {
  id: number;
  dateTime: string;
  format: string;
  duration: number;
  price: number;
  filled: number;
  maxParticipants: number;
  subject: string;
  instructorName: string;
  instructorId: number;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const clickedStyle =
    "flex items-center w-[89%] h-[80%] bg-[#ADEBC8]/67 rounded-4xl";
  const defaultStyle = "flex items-center w-[89%] h-[80%]";

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const params = new URLSearchParams();
        const dataRes = await api.get("/api/student/schedules", {
          params,
        });
        setAppointments(dataRes.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error);
      }
    };
    //setAppointments(appointmentsData);

    fetchAppointments();
  }, []);

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
        <div className="flex items-center bg-[#D9D9D9] w-5/12 rounded-3xl cursor-pointer">
          <img src="/images/search_icon.png" className="w-11 ml-2"></img>
          <p
            className="text-blue-dark/60 font-bold text-xl ml-1"
            onClick={() => {
              navigate("/schedules/search");
            }}
          >
            Pretražite termine
          </p>
        </div>
        <button
          className="bg-blue-light text-white text-xl p-3 px-15 rounded-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Profil
        </button>
      </div>

      <div className="flex h-5/6">
        <div className="flex justify-center w-1/5 bg-[#F8FFFC] ">
          <div className="bg-green-light h-5/12 mt-22 w-11/12 rounded-2xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
            <ul className="h-full p-1">
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(1)}
              >
                <div className={selected == 1 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/termin_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Termini</p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(2)}
              >
                <div className={selected == 2 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/video_sesije_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">
                    Video sesije
                  </p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(3)}
              >
                <div className={selected == 3 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/kvizovi_logo.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Kvizovi</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-4/5">
          {selected == 1 && (
            <StudentSchedule
              search={false}
              appointments={appointments}
            ></StudentSchedule>
          )}
          {selected == 2 && <p>Video sesije</p>}
          {selected == 3 && <p>Kvizovi</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
