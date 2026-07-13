-- =============================================================
-- GovConnect NG: Row Level Security Policies
-- =============================================================

-- ===================== USERS =====================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can read all users
CREATE POLICY "admins_select_all_users" ON public.users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Service role can manage users (for edge functions)
CREATE POLICY "service_role_users" ON public.users
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== ADMINS =====================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin records
CREATE POLICY "admins_select_own" ON public.admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Service role can manage admins
CREATE POLICY "service_role_admins" ON public.admins
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== REPORTS =====================
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own reports
CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create reports
CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own reports (only before status changes)
CREATE POLICY "reports_update_own" ON public.reports
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can read all reports
CREATE POLICY "admins_select_reports" ON public.reports
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Admins can update reports (status changes)
CREATE POLICY "admins_update_reports" ON public.reports
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Service role can manage reports
CREATE POLICY "service_role_reports" ON public.reports
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== APPOINTMENTS =====================
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Users can read their own appointments
CREATE POLICY "appointments_select_own" ON public.appointments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create appointments
CREATE POLICY "appointments_insert_own" ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own appointments
CREATE POLICY "appointments_update_own" ON public.appointments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can read all appointments
CREATE POLICY "admins_select_appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Admins can update appointments
CREATE POLICY "admins_update_appointments" ON public.appointments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Service role can manage appointments
CREATE POLICY "service_role_appointments" ON public.appointments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== SERVICES =====================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can read active services
CREATE POLICY "services_select_public" ON public.services
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins can manage services
CREATE POLICY "admins_manage_services" ON public.services
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Service role can manage services
CREATE POLICY "service_role_services" ON public.services
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== NOTIFICATIONS =====================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can mark their own notifications as read
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role can create notifications (for edge functions)
CREATE POLICY "service_role_notifications" ON public.notifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================== ANNOUNCEMENTS =====================
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read active announcements
CREATE POLICY "announcements_select_public" ON public.announcements
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins can manage announcements
CREATE POLICY "admins_manage_announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Service role can manage announcements
CREATE POLICY "service_role_announcements" ON public.announcements
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
