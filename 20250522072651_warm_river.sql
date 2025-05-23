/*
  # Add RLS policies for tables

  1. Changes
    - Add RLS policies for doctors table
    - Add RLS policies for services table
    - Add RLS policies for doctor_services table
    - Add RLS policies for unavailability table
    - Add RLS policies for schedules table

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
    - Add policies for service role to have full access
*/

-- Doctors table policies
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON doctors FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON doctors FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON doctors FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON doctors FOR DELETE
TO authenticated
USING (true);

-- Services table policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON services FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON services FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON services FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON services FOR DELETE
TO authenticated
USING (true);

-- Doctor_services table policies
ALTER TABLE doctor_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON doctor_services FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON doctor_services FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON doctor_services FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON doctor_services FOR DELETE
TO authenticated
USING (true);

-- Unavailability table policies
ALTER TABLE unavailability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON unavailability FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON unavailability FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON unavailability FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON unavailability FOR DELETE
TO authenticated
USING (true);

-- Schedules table policies
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON schedules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON schedules FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON schedules FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON schedules FOR DELETE
TO authenticated
USING (true);