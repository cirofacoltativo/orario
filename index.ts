export type TimeSlot = '8-14' | '14-20' | '20-8';

export interface Doctor {
  id: string;
  name: string;
  surname: string;
  fullName: string;
  weeklyHours: number;
  isSpecialist: boolean;
  services: Service[];
  preferredServices: Service[];
}

export interface Service {
  id: string;
  name: string;
  timeSlot: TimeSlot;
  days: string[];
  doctorsRequired: number;
}

export interface UnavailabilityRecord {
  id: string;
  doctorId: string;
  date: string;
  timeSlot: TimeSlot;
  reason: string;
}

export interface ScheduleEntry {
  id: string;
  doctorId: string;
  serviceId: string;
  date: string;
  timeSlot: TimeSlot;
}

export interface ScheduleDay {
  date: string;
  shifts: ScheduleShift[];
}

export interface ScheduleShift {
  timeSlot: TimeSlot;
  service: Service;
  doctor?: Doctor;
  isUnfilled?: boolean;
}

export interface ScheduleSummary {
  doctorId: string;
  doctorName: string;
  totalShifts: number;
  nightShifts: number;
  weekendShifts: number;
  serviceBreakdown: Record<string, number>;
}