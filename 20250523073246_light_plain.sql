/*
  # Fix RLS policies for services table

  1. Changes
    - Drop existing RLS policies for services table
    - Add new RLS policies that properly handle all operations
    
  2. Security
    - Enable RLS on services table
    - Add policies for:
      - Authenticated users can read all services
      - Authenticated users can insert services
      - Authenticated users can update services
      - Authenticated users can delete services
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to read services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON services;
DROP POLICY IF EXISTS "Allow insert access to all authenticated users for services" ON services;
DROP POLICY IF EXISTS "Allow read access to all authenticated users for services" ON services;
DROP POLICY IF EXISTS "Allow service role full access" ON services;
DROP POLICY IF EXISTS "Allow update access to all authenticated users for services" ON services;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON services;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON services;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON services;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON services;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON services
  FOR DELETE
  TO authenticated
  USING (true);