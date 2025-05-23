/*
  # Fix RLS policies and service table structure

  1. Changes
    - Add proper RLS policies for doctors table
    - Modify services table to use text for time_slot
    - Add duration column default value

  2. Security
    - Enable RLS on doctors table
    - Add policies for authenticated users to perform CRUD operations
*/

-- Fix services table structure
ALTER TABLE services 
  ALTER COLUMN time_slot TYPE text,
  ALTER COLUMN duration SET DEFAULT 30;

-- Update RLS policies for doctors table
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read access to all authenticated users for doctors" ON doctors;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON doctors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON doctors;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON doctors;

-- Create new policies
CREATE POLICY "Enable read for authenticated users"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON doctors
  FOR DELETE
  TO authenticated
  USING (true);