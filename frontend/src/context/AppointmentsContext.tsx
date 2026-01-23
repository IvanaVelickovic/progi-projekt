import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

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

interface AppointmentsContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined
);

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error("useAppointments must be used inside AppointmentsProvider");
  }
  return context;
};

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  return (
    <AppointmentsContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </AppointmentsContext.Provider>
  );
};