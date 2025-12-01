-- Update handle_new_user to stop auto-assigning OWNER role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create a basic profile for every new auth user
  INSERT INTO public.profiles (id, shop_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'shop_name', 'My Shop')
  );
  
  -- Roles (OWNER, SALES_REP) are now assigned explicitly from the app
  RETURN NEW;
END;
$$;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Owners can view shop profiles" ON public.profiles;

-- Allow owners to view profiles for their shop members
CREATE POLICY "Owners can view shop profiles"
ON public.profiles
FOR SELECT
USING (
  -- Owners can see their own profile and profiles of users linked to them
  id = auth.uid() OR owner_id = auth.uid()
);

-- Clean up existing duplicate OWNER roles for staff members
-- Any user with a non-null owner_id in profiles is considered a staff member
DELETE FROM public.user_roles
WHERE role = 'OWNER'
  AND user_id IN (
    SELECT id FROM public.profiles
    WHERE owner_id IS NOT NULL
  );