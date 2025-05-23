/*
  # Fix RLS policies and add missing columns

  1. Changes
    - Add missing columns to services table:
      - `time_slot` (integer)
      - `days` (text[])
      - `doctors_required` (integer)
    
    - Update RLS policies for doctors table:
      - Fix INSERT policy to properly allow authenticated users
      - Fix UPDATE policy to properly allow authenticated users
      - Fix DELETE policy to properly allow authenticated users

  2. Security
    - Modify RLS policies to be more permissive for authenticated users
    - Ensure all operations are properly secured
*/

-- Add missing columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS time_slot integer NOT NULL DEFAULT 30;
ALTER TABLE services ADD COLUMN IF NOT EXISTS days text[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS doctors_required integer NOT NULL DEFAULT 1;

-- Drop existing policies for doctors table
DROP POLICY IF EXISTS "Allow insert access to all authenticated users for doctors" ON doctors;
DROP POLICY IF EXISTS "Allow update access to all authenticated users for doctors" ON doctors;

-- Create new, more permissive policies for doctors table
CREATE POLICY "Enable insert for authenticated users only"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
  ON doctors
  FOR DELETE
  TO authenticated
  USING (true);