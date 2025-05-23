import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

const ScheduleGeneratorPage: React.FC = () => {
  const { generateSchedule, loading } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const handleGenerateSchedule = async () => {
    try {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      
      await generateSchedule(year, month);
      toast.success('Orario generato con successo!');
    } catch (error) {
      toast.error('Errore durante la generazione dell\'orario');
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Genera Orario
        </h1>
        <p className="text-gray-600">
          Seleziona il mese per cui vuoi generare l'orario
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Seleziona Periodo
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <DayPicker
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              locale={it}
              fromMonth={new Date()}
              toMonth={new Date(new Date().setMonth(new Date().getMonth() + 12))}
              captionLayout="dropdown-buttons"
              showOutsideDays
              footer={selectedMonth && (
                <p className="text-center p-2 bg-gray-50 border-t border-gray-200">
                  {format(selectedMonth, 'MMMM yyyy', { locale: it })}
                </p>
              )}
              styles={{
                root: { width: '100%' },
                caption: { color: '#0d9488' },
                day_selected: { backgroundColor: '#0d9488' },
              }}
            />
          </div>
          
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Riepilogo Generazione
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  Periodo selezionato:
                </p>
                <p className="font-medium text-gray-800">
                  {format(selectedMonth, 'MMMM yyyy', { locale: it })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  L'orario verrà generato considerando:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  <li>Indisponibilità dei medici</li>
                  <li>Servizi preferenziali</li>
                  <li>Regole di distribuzione turni</li>
                  <li>Monte ore settimanale</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={handleGenerateSchedule}
              disabled={loading}
              className="w-full mt-6 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generazione in corso...' : 'Genera Orario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGeneratorPage;