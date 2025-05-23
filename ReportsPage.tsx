import React from 'react';
import { useApp } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { it } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const ReportsPage: React.FC = () => {
  const { doctors, schedules, services } = useApp();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());

  // Calculate statistics for each doctor
  const doctorStats = React.useMemo(() => {
    const stats = doctors.map(doctor => {
      const doctorSchedules = schedules.filter(s => s.doctorId === doctor.id);
      
      const totalShifts = doctorSchedules.length;
      const nightShifts = doctorSchedules.filter(s => s.timeSlot === '20-8').length;
      const weekendShifts = doctorSchedules.filter(s => {
        const date = new Date(s.date);
        return isWeekend(date);
      }).length;
      
      // Calculate service breakdown
      const serviceBreakdown: Record<string, number> = {};
      doctorSchedules.forEach(schedule => {
        const service = services.find(s => s.id === schedule.serviceId);
        if (service) {
          serviceBreakdown[service.name] = (serviceBreakdown[service.name] || 0) + 1;
        }
      });
      
      return {
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        totalShifts,
        nightShifts,
        weekendShifts,
        serviceBreakdown,
      };
    });
    
    return stats;
  }, [doctors, schedules, services]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Report Statistiche</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorStats.map(stat => (
          <div key={stat.doctorId} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{stat.doctorName}</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Turni Totali</p>
                <p className="text-2xl font-bold text-teal-600">{stat.totalShifts}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Turni Notturni</p>
                <p className="text-2xl font-bold text-indigo-600">{stat.nightShifts}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Turni Weekend</p>
                <p className="text-2xl font-bold text-purple-600">{stat.weekendShifts}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Distribuzione Servizi</p>
                <div className="space-y-1">
                  {Object.entries(stat.serviceBreakdown).map(([service, count]) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="text-sm">{service}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;