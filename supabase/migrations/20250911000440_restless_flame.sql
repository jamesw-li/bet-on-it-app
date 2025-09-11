/*
  # Fix User Signup Database Error

  1. Database Functions
    - Create `handle_new_user()` function to automatically create profiles
    - Set up trigger on auth.users to call this function

  2. Security
    - Function runs with SECURITY DEFINER to access auth schema
    - Handles profile creation automatically on user signup

  This resolves the "Database error saving new user" issue by ensuring
  profiles are created automatically when users sign up.
*/

-- Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists (to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a trigger to call the function after a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();