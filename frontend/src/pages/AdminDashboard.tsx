import { useEffect, useState } from "react";
import AdminUsers from "./AdminUsers";
//import appointmentsData from "../assets/appointments.json";

const AdminDashboard = () => {
  const [selected, setSelected] = useState(1);
  const clickedStyle =
    "flex items-center w-[89%] h-[80%] bg-[#ADEBC8]/67 rounded-4xl";
  const defaultStyle = "flex items-center w-[89%] h-[80%]";

  useEffect(() => {}, []);

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center content-end p-10 bg-green-dark/50 h-[14%] shadow">
        <h1 className="text-blue-dark text-[2.7rem] font-bold">
          STEM tutorstvo
        </h1>
      </div>

      <div className="flex h-[86%]">
        <div className="flex justify-center w-1/5 bg-[#F8FFFC]">
          <div className="bg-green-light h-5/12 mt-22 w-11/12 rounded-2xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
            <ul className="h-full p-1">
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(1)}
              >
                <div className={selected == 1 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/statistics.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Statistika</p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(2)}
              >
                <div className={selected == 2 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/user_control.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Korisnici</p>
                </div>
              </li>
              <li
                className="flex items-center justify-center h-1/3 cursor-pointer"
                onClick={() => setSelected(3)}
              >
                <div className={selected == 3 ? clickedStyle : defaultStyle}>
                  <img
                    src="/images/review_control.png"
                    className="h-15 ml-4 mr-2"
                  ></img>
                  <p className="text-blue-dark font-bold text-xl">Recenzije</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-4/5 overflow-y-auto bg-[#EFFFF6]">
          {selected == 1 && <p>Statistika</p>}
          {selected == 2 && <AdminUsers />}
          {selected == 3 && <p>Recenzije</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
