-- Drop existing problematic policies on user_roles
DROP POLICY IF EXISTS "Owners can view all roles in their shop" ON public.user_roles;
DROP POLICY IF EXISTS "Owners can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create simple, non-recursive policies
-- Policy 1: Users can always view their own role
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Policy 2: Owners can insert new roles (checking their own role without recursion)
CREATE POLICY "Owners can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'OWNER'::app_role
  )
);

-- Policy 3: Owners can view roles of users in their shop
-- This checks if the requesting user is an owner and can see roles
-- of users linked to them (sales reps with their owner_id)
CREATE POLICY "Owners can view their shop roles"
ON public.user_roles
FOR SELECT
USING (
  user_id IN (
    SELECT p.id 
    FROM public.profiles p
    WHERE p.owner_id = auth.uid()
    OR p.id = auth.uid()
  )
);