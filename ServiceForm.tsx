import React from 'react';
import { useForm } from 'react-hook-form';
import { Service, TimeSlot } from '../types';
import { X } from 'lucide-react';
import { TIME_SLOTS } from '../constants';

interface ServiceFormProps {
  service?: Partial<Service>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Lunedì' },
  { value: 'Tuesday', label: 'Martedì' },
  { value: 'Wednesday', label: 'Mercoledì' },
  { value: 'Thursday', label: 'Giovedì' },
  { value: 'Friday', label: 'Venerdì' },
  { value: 'Saturday', label: 'Sabato' },
  { value: 'Sunday', label: 'Domenica' },
];

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: service?.name || '',
      timeSlot: service?.timeSlot || '8-14',
      doctorsRequired: service?.doctorsRequired || 1,
      days: service?.days || []
    }
  });
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {service?.id ? 'Modifica Servizio' : 'Aggiungi Nuovo Servizio'}
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
            Nome Servizio
          </label>
          <input
            {...register('name', { required: 'Il nome è obbligatorio' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fascia Oraria
            </label>
            <select
              {...register('timeSlot', { required: 'La fascia oraria è obbligatoria' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot === '8-14' ? 'Mattina (8-14)' : 
                   slot === '14-20' ? 'Pomeriggio (14-20)' : 
                   'Notte (20-8)'}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medici Richiesti
            </label>
            <input
              type="number"
              {...register('doctorsRequired', { 
                required: 'Il numero di medici è obbligatorio',
                min: { value: 1, message: 'Deve essere almeno 1' },
                max: { value: 3, message: 'Non può essere più di 3' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.doctorsRequired && (
              <p className="mt-1 text-sm text-red-600">{errors.doctorsRequired.message}</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giorni
          </label>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500 mb-2">
              Seleziona i giorni in cui viene svolto il servizio
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <label key={day.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('days')}
                    value={day.value}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">{day.label}</span>
                </label>
              ))}
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
            {service?.id ? 'Aggiorna' : 'Aggiungi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;