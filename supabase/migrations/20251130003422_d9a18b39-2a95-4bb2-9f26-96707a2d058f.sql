-- Add owner_id to profiles to link sales reps to their shop owner
ALTER TABLE public.profiles
ADD COLUMN owner_id uuid REFERENCES public.profiles(id);

-- Update get_user_shop_id function to return owner's shop for sales reps
CREATE OR REPLACE FUNCTION public.get_user_shop_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT owner_id FROM public.profiles WHERE id = _user_id AND owner_id IS NOT NULL),
    _user_id
  )
$$;

-- Update handle_new_user to assign OWNER role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, shop_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'shop_name', 'My Shop')
  );
  
  -- Assign OWNER role by default on signup
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'OWNER');
  
  RETURN NEW;
END;
$$;