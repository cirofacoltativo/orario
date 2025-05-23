import React, { createContext, useState, useContext, useEffect } from 'react';
import { Doctor, Service, UnavailabilityRecord, ScheduleEntry } from '../types';
import { supabase } from '../lib/supabase';
import { INITIAL_DOCTORS, DEFAULT_SERVICES } from '../constants';

interface AppContextType {
  doctors: Doctor[];
  services: Service[];
  unavailability: UnavailabilityRecord[];
  schedules: ScheduleEntry[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'fullName' | 'services' | 'preferredServices'>) => Promise<void>;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addUnavailability: (unavailability: Omit<UnavailabilityRecord, 'id'>) => Promise<void>;
  deleteUnavailability: (id: string) => Promise<void>;
  generateSchedule: (year: number, month: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [unavailability, setUnavailability] = useState<UnavailabilityRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      
      setIsAuthenticated(!!session);
      if (!session) {
        setDoctors([]);
        setServices([]);
        setUnavailability([]);
        setSchedules([]);
        return;
      }

      // Fetch doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*');
      
      if (doctorsError) throw doctorsError;
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');
      
      if (servicesError) throw servicesError;
      
      // Fetch doctor services relationships
      const { data: doctorServicesData, error: doctorServicesError } = await supabase
        .from('doctor_services')
        .select('*');
      
      if (doctorServicesError) throw doctorServicesError;
      
      // Fetch unavailability
      const { data: unavailabilityData, error: unavailabilityError } = await supabase
        .from('unavailability')
        .select('*');
      
      if (unavailabilityError) throw unavailabilityError;
      
      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*');
      
      if (schedulesError) throw schedulesError;
      
      // Process the data
      const processedServices = servicesData?.map((service) => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        timeSlot: service.time_slot,
        days: service.days,
        doctorsRequired: service.doctors_required,
      })) || [];
      
      const processedDoctors = doctorsData?.map((doctor) => {
        const doctorServices = doctorServicesData
          .filter(ds => ds.doctor_id === doctor.id)
          .map(ds => {
            const service = processedServices.find(s => s.id === ds.service_id);
            return service;
          })
          .filter(Boolean) as Service[];
        
        return {
          id: doctor.id,
          name: doctor.name,
          surname: doctor.surname,
          fullName: `${doctor.name} ${doctor.surname}`,
          weeklyHours: doctor.weekly_hours,
          isSpecialist: doctor.is_specialist,
          services: doctorServices,
          preferredServices: [], // Removed preferred services as it's not in the schema
        };
      }) || [];
      
      const processedUnavailability = unavailabilityData?.map((record) => ({
        id: record.id,
        doctorId: record.doctor_id,
        startTime: record.start_time,
        endTime: record.end_time,
        reason: record.reason,
      })) || [];
      
      const processedSchedules = schedulesData?.map((schedule) => ({
        id: schedule.id,
        doctorId: schedule.doctor_id,
        serviceId: schedule.service_id,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
      })) || [];
      
      setDoctors(processedDoctors);
      setServices(processedServices);
      setUnavailability(processedUnavailability);
      setSchedules(processedSchedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      refreshData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initialize data if empty
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        
        setIsAuthenticated(!!session);
        
        // Only proceed with initialization if authenticated and data is empty
        if (session && !loading && doctors.length === 0 && services.length === 0) {
          // Insert initial doctors
          for (const doctor of INITIAL_DOCTORS) {
            await addDoctor(doctor);
          }
          
          // Insert default services
          for (const service of DEFAULT_SERVICES) {
            await addService(service);
          }
          
          await refreshData();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      }
    };
    
    initializeData();
  }, [loading, doctors.length, services.length]);

  const addDoctor = async (doctor: Omit<Doctor, 'id' | 'fullName' | 'services' | 'preferredServices'>) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          name: doctor.name,
          surname: doctor.surname,
          weekly_hours: doctor.weeklyHours,
          is_specialist: doctor.isSpecialist,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const updateDoctor = async (id: string, doctor: Partial<Doctor>) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('doctors')
        .update({
          name: doctor.name,
          surname: doctor.surname,
          weekly_hours: doctor.weeklyHours,
          is_specialist: doctor.isSpecialist,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: service.name,
          duration: service.duration,
          time_slot: service.timeSlot,
          days: service.days,
          doctors_required: service.doctorsRequired,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
      throw err; // Re-throw to handle in the calling code
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('services')
        .update({
          name: service.name,
          duration: service.duration,
          time_slot: service.timeSlot,
          days: service.days,
          doctors_required: service.doctorsRequired,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const addUnavailability = async (unavailability: Omit<UnavailabilityRecord, 'id'>) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('unavailability')
        .insert([{
          doctor_id: unavailability.doctorId,
          start_time: unavailability.startTime,
          end_time: unavailability.endTime,
          reason: unavailability.reason,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      await refreshData();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const deleteUnavailability = async (id: string) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('unavailability')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    }
  };

  const generateSchedule = async (year: number, month: number) => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) throw new Error('User not authenticated');

      setLoading(true);
      
      // Clear existing schedules for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      // Format dates for DB query
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      // Delete existing schedules for this month
      const { error: deleteError } = await supabase
        .from('schedules')
        .delete()
        .gte('start_time', startDateStr)
        .lte('end_time', endDateStr);
      
      if (deleteError) throw deleteError;
      
      // Implementation of the scheduling algorithm would go here
      // For now, just add some placeholder schedules
      
      // After generating the schedule, refresh data
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    doctors,
    services,
    unavailability,
    schedules,
    loading,
    error,
    isAuthenticated,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addService,
    updateService,
    deleteService,
    addUnavailability,
    deleteUnavailability,
    generateSchedule,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};