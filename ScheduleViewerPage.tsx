import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const ScheduleViewerPage: React.FC = () => {
  const { doctors, services, schedules } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Visualizza Orario</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Seleziona Mese</h2>
          <DayPicker
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => date && setSelectedMonth(date)}
            locale={it}
            captionLayout="dropdown"
            fromYear={2024}
            toYear={2025}
            footer={selectedMonth ? (
              <p className="text-center p-2 bg-gray-50 border-t border-gray-200">
                {format(selectedMonth, 'MMMM yyyy', { locale: it })}
              </p>
            ) : null}
            styles={{
              root: { width: '100%' },
              caption: { color: '#0d9488' },
              day_selected: { backgroundColor: '#0d9488' },
            }}
          />
        </div>
        
        <div className="md:col-span-3">
          <ScheduleCalendar
            year={selectedMonth.getFullYear()}
            month={selectedMonth.getMonth() + 1}
            doctors={doctors}
            services={services}
            schedules={schedules}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewerPage;