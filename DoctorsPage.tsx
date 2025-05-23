import React from 'react';
import DoctorForm from '../components/DoctorForm';

const DoctorsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctors Management</h1>
        <p className="mt-2 text-gray-600">Add and manage doctor information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <DoctorForm />
      </div>
    </div>
  );
};

export default DoctorsPage;