import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";

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

interface StudentScheduleProps {
  search: boolean;
  appointments: Appointment[];
}

const StudentSchedule = ({ search, appointments }: StudentScheduleProps) => {
  const navigate = useNavigate();

  const appointmentDates = Array.isArray(appointments)
    ? appointments.map((item) => item.dateTime.split("T")[0])
    : [];

  return (
    <div className={search ? "flex h-full w-3/4" : "flex h-full"}>
      <div
        className={
          search
            ? "w-full p-5 flex flex-col bg-[#F8FFFC]"
            : "w-3/4 p-5 flex flex-col"
        }
      >
        <h1 className="text-blue-dark text-3xl font-bold">
          {search ? "Pretraga termina" : "Rezervirani termini"}
        </h1>
        <div
          className={
            search
              ? "flex flex-col items-center mt-5 bg-green-light/65 pt-5 rounded-2xl"
              : "flex flex-col items-center mt-5 overflow-y-scroll"
          }
        >
          {appointments.length != 0 ? (
            appointments.map((item, index) => (
              <div
                key={item.id}
                id={item.dateTime.split("T")[0]}
                className="flex justify-between bg-[#ADEBC8] border-2 border-blue-dark rounded-2xl w-11/12 h-[250px] mb-6 shrink-0 drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]"
              >
                <div className="w-7/12 p-5">
                  {search == true ? (
                    <h1 className="text-blue-dark text-2xl font-bold">
                      Termin - {item.subject}
                    </h1>
                  ) : (
                    <h1 className="text-blue-dark text-2xl font-bold">
                      Termin {index + 1} - {item.subject}
                    </h1>
                  )}
                  <h1
                    className="text-blue-dark/93 text-xl font-bold ml-1 cursor-pointer hover:text-blue-dark/70"
                    onClick={() => {
                      navigate(`/instructors/${item.instructorId}`);
                    }}
                  >
                    Instruktor: <u>{item.instructorName}</u>
                  </h1>
                  <div className="p-5 pt-7 text-blue-dark font-semibold text-xl">
                    <div className="flex justify-between ">
                      <span>• Održavanje</span>
                      <span>
                        {item.format === "in_person" ? "uživo" : "online"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Trajanje</span>
                      <span>{item.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Cijena po terminu:</span>
                      <span>{item.price} €</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between w-4/12">
                  <div className="w-9/12 p-4 m-3 bg-white rounded-2xl text-lg text-blue-dark font-semibold text-center">
                    {item.dateTime.split("T")[0]}
                    <br></br>
                    {item.dateTime.split("T")[1]}
                  </div>
                  <div className="flex flex-col m-3 p-2 w-10/12 items-end gap-y-2">
                    <div className="bg-[#D9D9D9] p-3 rounded-3xl text-lg text-blue-dark font-semibold text-center px-6 w-full">
                      Popunjenost:{" "}
                      {item.filled === undefined ? "0" : item.filled}/
                      {item.maxParticipants}
                    </div>
                    {search && (
                      <button
                        className="bg-blue-light p-2.5 rounded-3xl text-lg text-white text-center px-6 cursor-pointer w-full"
                        onClick={() => {
                          navigate(`/booking-confirmation/${item.id}`);
                        }}
                      >
                        Rezerviraj
                      </button>
                    )}
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
      {!search && (
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
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;
