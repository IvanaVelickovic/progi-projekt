import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export interface Appointment {
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

interface AppointmentsContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const StudentSearchContext = createContext<AppointmentsContextType | undefined>(
  undefined,
);

export const useStudentAppointments = () => {
  const context = useContext(StudentSearchContext);
  if (!context) {
    throw new Error("useAppointments must be used inside AppointmentsProvider");
  }
  return context;
};

export const StudentSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  return (
    <StudentSearchContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </StudentSearchContext.Provider>
  );
};
