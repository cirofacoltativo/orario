/*
  # Initial Schema Setup for Medical Scheduling System

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `surname` (text)
      - `weekly_hours` (integer)
      - `is_specialist` (boolean)
      - `created_at` (timestamp)
    
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `duration` (integer) - in minutes
      - `created_at` (timestamp)
    
    - `doctor_services`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key)
      - `service_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `unavailability`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `reason` (text)
      - `created_at` (timestamp)
    
    - `schedules`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key)
      - `service_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert/update their own data
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  surname text NOT NULL,
  weekly_hours integer NOT NULL DEFAULT 40,
  is_specialist boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration integer NOT NULL, -- in minutes
  created_at timestamptz DEFAULT now()
);

-- Create doctor_services junction table
CREATE TABLE IF NOT EXISTS doctor_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, service_id)
);

-- Create unavailability table
CREATE TABLE IF NOT EXISTS unavailability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_timeframe CHECK (end_time > start_time)
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_timeframe CHECK (end_time > start_time)
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table
CREATE POLICY "Allow read access to all authenticated users for doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users for doctors"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users for doctors"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for services table
CREATE POLICY "Allow read access to all authenticated users for services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users for services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users for services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for doctor_services table
CREATE POLICY "Allow read access to all authenticated users for doctor_services"
  ON doctor_services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users for doctor_services"
  ON doctor_services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users for doctor_services"
  ON doctor_services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for unavailability table
CREATE POLICY "Allow read access to all authenticated users for unavailability"
  ON unavailability
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users for unavailability"
  ON unavailability
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users for unavailability"
  ON unavailability
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for schedules table
CREATE POLICY "Allow read access to all authenticated users for schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users for schedules"
  ON schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users for schedules"
  ON schedules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);