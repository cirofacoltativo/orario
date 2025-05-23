/*
  # Update services table RLS policies

  1. Security Changes
    - Enable RLS on services table
    - Add policy for authenticated users to perform all operations
    - Add policy for service role to perform all operations

  This migration updates the Row Level Security (RLS) policies for the services table
  to allow authenticated users to perform all operations (insert, select, update, delete).
  This is necessary to allow the application to initialize default services.
*/

-- Enable RLS on services table (if not already enabled)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON services;
DROP POLICY IF EXISTS "Allow service role full access" ON services;

-- Create new policies
CREATE POLICY "Allow full access to authenticated users"
ON services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role full access"
ON services
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);