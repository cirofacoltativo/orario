import React from 'react';
import { useForm } from 'react-hook-form';
import { Doctor, Service } from '../types';
import { X } from 'lucide-react';

interface DoctorFormProps {
  doctor?: Partial<Doctor>;
  services: Service[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, services, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: doctor?.name || '',
      surname: doctor?.surname || '',
      weeklyHours: doctor?.weeklyHours || 38,
      isSpecialist: doctor?.isSpecialist !== undefined ? doctor.isSpecialist : true,
      // services and preferred services would need additional handling
    }
  });
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {doctor?.id ? 'Modifica Medico' : 'Aggiungi Nuovo Medico'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              {...register('name', { required: 'Il nome è obbligatorio' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cognome
            </label>
            <input
              {...register('surname', { required: 'Il cognome è obbligatorio' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monte Ore Settimanali
            </label>
            <input
              type="number"
              {...register('weeklyHours', { 
                required: 'Il monte ore è obbligatorio',
                min: { value: 1, message: 'Il monte ore deve essere positivo' },
                max: { value: 60, message: 'Il monte ore deve essere minore di 60' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.weeklyHours && (
              <p className="mt-1 text-sm text-red-600">{errors.weeklyHours.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('isSpecialist')}
                  value="true"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2">Specialista</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('isSpecialist')}
                  value="false"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2">Decreto Calabria</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Services selection would go here */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servizi
          </label>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500 mb-2">
              Seleziona i servizi che può svolgere
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {services.map((service) => (
                <label key={service.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={`services.${service.id}`}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">{service.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Preferred services selection would go here */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servizi Preferenziali
          </label>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500 mb-2">
              Seleziona i servizi in cui preferibilmente deve essere allocato
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {services.map((service) => (
                <label key={service.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={`preferredServices.${service.id}`}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">{service.name}</span>
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
            {doctor?.id ? 'Aggiorna' : 'Aggiungi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;