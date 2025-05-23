import React from 'react';
import { useForm } from 'react-hook-form';
import { Doctor, UnavailabilityRecord, TimeSlot } from '../types';
import { X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { TIME_SLOTS } from '../constants';

interface UnavailabilityFormProps {
  doctors: Doctor[];
  unavailability?: UnavailabilityRecord;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UnavailabilityForm: React.FC<UnavailabilityFormProps> = ({ 
  doctors, 
  unavailability, 
  onSubmit, 
  onCancel 
}) => {
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    unavailability?.date ? new Date(unavailability.date) : undefined
  );
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      doctorId: unavailability?.doctorId || '',
      date: unavailability?.date || '',
      timeSlot: unavailability?.timeSlot || '8-14',
      reason: unavailability?.reason || 'Libera Professione',
    }
  });
  
  React.useEffect(() => {
    if (selectedDay) {
      setValue('date', format(selectedDay, 'yyyy-MM-dd'));
    }
  }, [selectedDay, setValue]);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {unavailability?.id ? 'Modifica Indisponibilità' : 'Aggiungi Indisponibilità'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medico
          </label>
          <select
            {...register('doctorId', { required: 'Il medico è obbligatorio' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Seleziona un medico</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.fullName}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={it}
                footer={selectedDay ? (
                  <p className="text-center p-2 bg-gray-50 border-t border-gray-200">
                    {format(selectedDay, 'dd MMMM yyyy', { locale: it })}
                  </p>
                ) : null}
                styles={{
                  root: { width: '100%' },
                  caption: { color: '#0d9488' },
                  day_selected: { backgroundColor: '#0d9488' },
                }}
              />
            </div>
            <input
              type="hidden"
              {...register('date', { required: 'La data è obbligatoria' })}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fascia Oraria
              </label>
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => (
                  <label key={slot} className="block">
                    <input
                      type="radio"
                      {...register('timeSlot', { required: 'La fascia oraria è obbligatoria' })}
                      value={slot}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2">
                      {slot === '8-14' ? 'Mattina (8-14)' : 
                       slot === '14-20' ? 'Pomeriggio (14-20)' : 
                       'Notte (20-8)'}
                    </span>
                  </label>
                ))}
                <label className="block">
                  <input
                    type="radio"
                    {...register('timeSlot')}
                    value="8-20"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2">Giorno Intero (8-20)</span>
                </label>
              </div>
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivazione
              </label>
              <select
                {...register('reason', { required: 'La motivazione è obbligatoria' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Libera Professione">Libera Professione</option>
                <option value="Ferie">Ferie</option>
                <option value="Malattia">Malattia</option>
                <option value="Congedo">Congedo</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {unavailability?.id ? 'Aggiorna' : 'Aggiungi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnavailabilityForm;