import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { it } from 'date-fns/locale';
import { Doctor, Service, ScheduleEntry } from '../types';
import { SERVICE_ORDER } from '../constants';

interface ScheduleCalendarProps {
  year: number;
  month: number;
  doctors: Doctor[];
  services: Service[];
  schedules: ScheduleEntry[];
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  year,
  month,
  doctors,
  services,
  schedules,
}) => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const schedulesByDate: Record<string, ScheduleEntry[]> = {};
  
  schedules.forEach((schedule) => {
    const dateStr = format(new Date(schedule.date), 'yyyy-MM-dd');
    if (!schedulesByDate[dateStr]) {
      schedulesByDate[dateStr] = [];
    }
    schedulesByDate[dateStr].push(schedule);
  });
  
  const getDoctorById = (id: string) => doctors.find((doctor) => doctor.id === id);
  const getServiceById = (id: string) => services.find((service) => service.id === id);
  
  const getServiceColor = (serviceName: string) => {
    switch (serviceName) {
      case 'Reparto 8-14':
      case 'Reparto 14-20':
        return 'bg-blue-100';
      case 'Sala Parto 8-14':
      case 'Sala Parto 14-20':
        return 'bg-amber-100';
      case 'Guardia Notturna':
      case 'Primo Reperibile':
      case 'Secondo Reperibile':
        return 'bg-red-100';
      case 'Sala Operatoria':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const renderScheduleEntry = (schedule: ScheduleEntry) => {
    const doctor = getDoctorById(schedule.doctorId);
    const service = getServiceById(schedule.serviceId);
    
    if (!service) return null;
    
    return (
      <div
        key={schedule.id}
        className={`px-2 py-1 rounded text-sm ${getServiceColor(service.name)}`}
      >
        <div className="font-medium">{service.name}</div>
        <div>{doctor?.fullName || 'Non assegnato'}</div>
      </div>
    );
  };

  const sortSchedules = (schedules: ScheduleEntry[]) => {
    return [...schedules].sort((a, b) => {
      const serviceA = getServiceById(a.serviceId);
      const serviceB = getServiceById(b.serviceId);
      
      if (!serviceA || !serviceB) return 0;
      
      const indexA = SERVICE_ORDER.indexOf(serviceA.name);
      const indexB = SERVICE_ORDER.indexOf(serviceB.name);
      
      return indexA - indexB;
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-teal-600 text-white">
        <h2 className="text-xl font-semibold">
          {format(startDate, 'MMMM yyyy', { locale: it })}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mattina (8-14)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pomeriggio (14-20)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notte (20-8)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const daySchedules = schedulesByDate[dateStr] || [];
              
              const morningSchedules = sortSchedules(daySchedules.filter(s => s.timeSlot === '8-14'));
              const afternoonSchedules = sortSchedules(daySchedules.filter(s => s.timeSlot === '14-20'));
              const nightSchedules = sortSchedules(daySchedules.filter(s => s.timeSlot === '20-8'));
              
              return (
                <tr key={dateStr} className={isWeekend(day) ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {format(day, 'EEEE', { locale: it })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(day, 'd MMMM', { locale: it })}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {morningSchedules.map(renderScheduleEntry)}
                      {morningSchedules.length === 0 && (
                        <div className="text-sm text-gray-500">Nessun servizio</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {afternoonSchedules.map(renderScheduleEntry)}
                      {afternoonSchedules.length === 0 && (
                        <div className="text-sm text-gray-500">Nessun servizio</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {nightSchedules.map(renderScheduleEntry)}
                      {nightSchedules.length === 0 && (
                        <div className="text-sm text-gray-500">Nessun servizio</div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleCalendar;