-- =============================================================
-- GovConnect NG: Seed Government Services
-- =============================================================

INSERT INTO public.services (name, description, category, icon_name, color) VALUES
  ('Identity & NIN', 'National Identification Number registration, verification, and updates', 'Identity', 'ShieldCheck', 'bg-blue-100 text-blue-600'),
  ('Passport (NPS)', 'Nigeria Passport Service - new applications, renewals, and tracking', 'Travel', 'FileCheck', 'bg-green-100 text-green-600'),
  ('Law & Justice', 'Legal aid, court services, and justice system access', 'Legal', 'Scale', 'bg-indigo-100 text-indigo-600'),
  ('Tax Services (FIRS)', 'Federal tax filing, clearance certificates, and TIN registration', 'Finance', 'CreditCard', 'bg-orange-100 text-orange-600'),
  ('Healthcare (NHIS)', 'National Health Insurance Scheme enrollment and claims', 'Health', 'Heart', 'bg-red-100 text-red-600'),
  ('Education', 'Educational resources, scholarships, and certification services', 'Social', 'BookOpen', 'bg-purple-100 text-purple-600'),
  ('Vehicle Registration', 'Vehicle licensing, registration, and roadworthiness certificates', 'Transport', 'Car', 'bg-slate-100 text-slate-600'),
  ('Employment & Labor', 'Job placement, labor rights, and work permit services', 'Social', 'Briefcase', 'bg-emerald-100 text-emerald-600'),
  ('Social Welfare', 'Social intervention programs and welfare support services', 'Social', 'Users', 'bg-pink-100 text-pink-600')
ON CONFLICT DO NOTHING;
