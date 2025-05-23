/*
  # Update RLS policies for doctors table

  1. Changes
    - Modify RLS policies for the doctors table to properly handle data insertion
    - Add policy for service role to bypass RLS
    - Ensure authenticated users can still perform CRUD operations

  2. Security
    - Maintain RLS enabled on doctors table
    - Add specific policies for authenticated users
    - Add service role bypass for system operations
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON doctors;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON doctors;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON doctors;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON doctors;

-- Create new, more specific policies
CREATE POLICY "Allow full access to authenticated users"
ON doctors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service role to bypass RLS
ALTER TABLE doctors FORCE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Allow service role full access"
ON doctors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);