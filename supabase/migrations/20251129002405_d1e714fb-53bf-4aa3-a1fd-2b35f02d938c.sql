-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('OWNER', 'SALES_REP');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (CRITICAL: roles must be in separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rep_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's shop_id
CREATE OR REPLACE FUNCTION public.get_user_shop_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Owners can view all roles in their shop"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'OWNER')
  AND user_id IN (
    SELECT ur.user_id 
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() OR public.has_role(ur.user_id, 'SALES_REP')
  )
);

CREATE POLICY "Owners can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'OWNER'));

-- RLS Policies for inventory
CREATE POLICY "Shop members can view inventory"
ON public.inventory FOR SELECT
TO authenticated
USING (
  shop_id = public.get_user_shop_id(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND (role = 'OWNER' OR role = 'SALES_REP')
  )
);

CREATE POLICY "Shop members can insert inventory"
ON public.inventory FOR INSERT
TO authenticated
WITH CHECK (
  shop_id = public.get_user_shop_id(auth.uid())
  AND (public.has_role(auth.uid(), 'OWNER') OR public.has_role(auth.uid(), 'SALES_REP'))
);

CREATE POLICY "Shop members can update inventory"
ON public.inventory FOR UPDATE
TO authenticated
USING (
  shop_id = public.get_user_shop_id(auth.uid())
  AND (public.has_role(auth.uid(), 'OWNER') OR public.has_role(auth.uid(), 'SALES_REP'))
);

CREATE POLICY "Owners can delete inventory"
ON public.inventory FOR DELETE
TO authenticated
USING (
  shop_id = public.get_user_shop_id(auth.uid())
  AND public.has_role(auth.uid(), 'OWNER')
);

-- RLS Policies for sales
CREATE POLICY "Shop members can view sales"
ON public.sales FOR SELECT
TO authenticated
USING (
  shop_id = public.get_user_shop_id(auth.uid())
  OR rep_id = auth.uid()
  OR public.has_role(auth.uid(), 'OWNER')
);

CREATE POLICY "Sales reps can insert sales"
ON public.sales FOR INSERT
TO authenticated
WITH CHECK (
  rep_id = auth.uid()
  AND (public.has_role(auth.uid(), 'SALES_REP') OR public.has_role(auth.uid(), 'OWNER'))
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for inventory table
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup (creates profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, shop_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'shop_name', 'My Shop')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for sales table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER TABLE public.sales REPLICA IDENTITY FULL;