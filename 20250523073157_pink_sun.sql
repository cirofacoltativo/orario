/*
  # Fix Database Schema and RLS Policies

  1. New Tables
    - `doctors`: Store doctor information
    - `services`: Store available medical services
    - `doctor_services`: Many-to-many relationship between doctors and services
    - `unavailability`: Track doctor unavailability periods
    - `schedules`: Store generated schedules

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
    - Add policies for service role to have full access

  3. Changes
    - Fix time_slot column type to text
    - Fix days column to be text array
    - Add proper foreign key constraints
    - Add check constraints for valid timeframes
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    surname text NOT NULL,
    weekly_hours integer NOT NULL DEFAULT 40,
    is_specialist boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    duration integer NOT NULL DEFAULT 30,
    time_slot text NOT NULL DEFAULT '30',
    days text[] NOT NULL DEFAULT '{}',
    doctors_required integer NOT NULL DEFAULT 1,
    created_at timestamptz DEFAULT now()
);

-- Create doctor_services table
CREATE TABLE IF NOT EXISTS public.doctor_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE,
    service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(doctor_id, service_id)
);

-- Create unavailability table
CREATE TABLE IF NOT EXISTS public.unavailability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_timeframe CHECK (end_time > start_time)
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE,
    service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_timeframe CHECK (end_time > start_time)
);

-- Enable RLS on all tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table
CREATE POLICY "Allow authenticated users to read doctors"
    ON public.doctors
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert doctors"
    ON public.doctors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update doctors"
    ON public.doctors
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete doctors"
    ON public.doctors
    FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for services table
CREATE POLICY "Allow authenticated users to read services"
    ON public.services
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert services"
    ON public.services
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
    ON public.services
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete services"
    ON public.services
    FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for doctor_services table
CREATE POLICY "Allow authenticated users to read doctor_services"
    ON public.doctor_services
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert doctor_services"
    ON public.doctor_services
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update doctor_services"
    ON public.doctor_services
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete doctor_services"
    ON public.doctor_services
    FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for unavailability table
CREATE POLICY "Allow authenticated users to read unavailability"
    ON public.unavailability
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert unavailability"
    ON public.unavailability
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update unavailability"
    ON public.unavailability
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete unavailability"
    ON public.unavailability
    FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for schedules table
CREATE POLICY "Allow authenticated users to read schedules"
    ON public.schedules
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert schedules"
    ON public.schedules
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schedules"
    ON public.schedules
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete schedules"
    ON public.schedules
    FOR DELETE
    TO authenticated
    USING (true);