import { useEffect, useState } from "react";
import api from "../api";

interface Schedules {
  id: number;
  subject: string;
  datetime: string;
  selected: boolean;
}

interface AddToScheduleProps {
  quizId: number;
  quizName: string;
  setAddToSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  schedules: Schedules[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedules[]>>;
}

const AddToSchedule = ({
  quizId,
  quizName,
  setAddToSchedule,
  schedules,
  setSchedules,
}: AddToScheduleProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 "></div>

      <div className="relative bg-white rounded-xl w-1/2 h-9/12 z-10 border-2 border-blue-dark flex flex-col">
        <div className="flex justify-between items-center p-4 rounded-t-2xl">
          <div>
            <h1 className="text-blue-dark text-xl font-bold">
              Dodijeli kviz terminu
            </h1>
            <p className="text-blue-dark">
              Odaberite termine kojima želite dodijeliti kviz - {quizName}
            </p>
          </div>
          <button
            className="flex justify-center items-center bg-blue-dark rounded-full text-white px-2 text-2xl cursor-pointer"
            onClick={() => setAddToSchedule(false)}
          >
            X
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto p-5">
          {schedules.map((item, id) => (
            <div
              key={item.id}
              className="flex items-center min-h-[90px] shrink-0 bg-green-light border-2 border-blue-dark rounded-2xl px-5 gap-x-3"
            >
              <input
                type="checkbox"
                checked={item.selected}
                className="h-5 w-5"
              ></input>
              <div className="flex justify-between items-center w-full">
                <div className="text-blue-dark text-xl font-bold">
                  Termin {id + 1} - {item.subject}
                </div>
                <div className="flex gap-3 bg-white py-4 px-2 rounded-xl text-blue-dark font-bold">
                  <div>{item.datetime.split("T")[0]}</div>
                  <div>{item.datetime.split("T")[1]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-blue-light text-white py-3 px-2 rounded-2xl w-3/12 self-end mr-7 mb-1">
          Dodijeli terminima
        </button>
      </div>
    </div>
  );
};

export default AddToSchedule;
