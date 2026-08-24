CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY "categories admin write" ON public.categories USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "brands admin write" ON public.brands USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "products admin write" ON public.products USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "banners admin write" ON public.banners USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "testimonials admin write" ON public.testimonials USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "posts admin write" ON public.posts USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
ALTER POLICY "newsletter admin read" ON public.newsletter_subscribers USING (private.has_role(auth.uid(),'admin'));
ALTER POLICY "orders own read" ON public.orders USING (user_id = auth.uid() OR private.has_role(auth.uid(),'admin'));
ALTER POLICY "order items own read" ON public.order_items USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR private.has_role(auth.uid(),'admin'))));

DROP FUNCTION public.has_role(uuid, public.app_role);