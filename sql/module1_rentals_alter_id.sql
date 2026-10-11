-- Migration for Rentals table: Change ID to TEXT to match Order ID formats (PVRxxxx)

-- Drop the default value first
ALTER TABLE public.rentals ALTER COLUMN id DROP DEFAULT;

-- Change the data type to text
ALTER TABLE public.rentals ALTER COLUMN id TYPE TEXT USING id::TEXT;
