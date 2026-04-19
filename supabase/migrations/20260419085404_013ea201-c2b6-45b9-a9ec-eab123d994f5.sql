-- ============================================
-- IGNITIA'26 Phase 2 — Schema
-- ============================================

-- Enum for app roles (security-definer pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Enum for event categories
CREATE TYPE public.event_category AS ENUM ('tech', 'cultural', 'gaming', 'literary');

-- ===== profiles =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  college TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ===== user_roles =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer role check (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== events =====
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category public.event_category NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT[] NOT NULL DEFAULT '{}',
  team_size TEXT NOT NULL,
  min_team_size INT NOT NULL DEFAULT 1,
  max_team_size INT NOT NULL DEFAULT 1,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  prize TEXT NOT NULL,
  chip TEXT NOT NULL DEFAULT 'peach',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ===== registrations (a team registering for an event) =====
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 6)),
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, team_name)
);
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_registrations_event ON public.registrations(event_id);
CREATE INDEX idx_registrations_leader ON public.registrations(leader_id);

-- ===== team_members =====
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_leader BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (registration_id, user_id)
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_team_members_reg ON public.team_members(registration_id);

-- Helper: is the current user a member of this registration?
CREATE OR REPLACE FUNCTION public.is_team_member(_registration_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE registration_id = _registration_id AND user_id = _user_id
  )
$$;

-- Registration policies
CREATE POLICY "Members can view their registrations"
  ON public.registrations FOR SELECT
  USING (
    auth.uid() = leader_id
    OR public.is_team_member(id, auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Authenticated users can create registrations as leader"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Leader or admin can update registration"
  ON public.registrations FOR UPDATE
  USING (auth.uid() = leader_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Leader or admin can delete registration"
  ON public.registrations FOR DELETE
  USING (auth.uid() = leader_id OR public.has_role(auth.uid(), 'admin'));

-- Team members policies
CREATE POLICY "Members can view their team rows"
  ON public.team_members FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_team_member(registration_id, auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Users can join a team for themselves"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave their own team membership"
  ON public.team_members FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ===== contact_submissions =====
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ===== timestamps trigger =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== auto profile + leader-as-member triggers =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, college, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'phone'
  );
  -- Default 'user' role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add leader as a team member when registration is created
CREATE OR REPLACE FUNCTION public.add_leader_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.team_members (registration_id, user_id, is_leader)
  VALUES (NEW.id, NEW.leader_id, true)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_registration_created
  AFTER INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.add_leader_as_member();