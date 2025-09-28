-- Location: supabase/migrations/20250927114735_resqnet_emergency_response_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete emergency response system with authentication
-- Dependencies: New complete schema creation

-- 1. Extensions & Types
CREATE TYPE public.user_role AS ENUM ('victim', 'volunteer', 'admin');
CREATE TYPE public.alert_status AS ENUM ('pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled');
CREATE TYPE public.emergency_type AS ENUM ('medical', 'fire', 'accident', 'natural_disaster', 'security', 'other');
CREATE TYPE public.volunteer_status AS ENUM ('available', 'busy', 'offline');

-- 2. Core User Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'victim'::public.user_role,
    avatar_url TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    address TEXT,
    volunteer_status public.volunteer_status DEFAULT 'offline'::public.volunteer_status,
    skills TEXT[],
    availability_radius INTEGER DEFAULT 5000, -- meters
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Emergency Alerts Table
CREATE TABLE public.emergency_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    victim_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    emergency_type public.emergency_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    status public.alert_status DEFAULT 'pending'::public.alert_status,
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- 4. Alert Responses Table
CREATE TABLE public.alert_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.emergency_alerts(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    response_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    estimated_arrival INTEGER, -- minutes
    message TEXT,
    is_accepted BOOLEAN DEFAULT false,
    arrival_time TIMESTAMPTZ,
    completion_time TIMESTAMPTZ,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT
);

-- 5. Emergency Contacts Table
CREATE TABLE public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location_latitude, location_longitude);
CREATE INDEX idx_user_profiles_volunteer_status ON public.user_profiles(volunteer_status);
CREATE INDEX idx_emergency_alerts_victim_id ON public.emergency_alerts(victim_id);
CREATE INDEX idx_emergency_alerts_status ON public.emergency_alerts(status);
CREATE INDEX idx_emergency_alerts_location ON public.emergency_alerts(latitude, longitude);
CREATE INDEX idx_emergency_alerts_created_at ON public.emergency_alerts(created_at);
CREATE INDEX idx_alert_responses_alert_id ON public.alert_responses(alert_id);
CREATE INDEX idx_alert_responses_volunteer_id ON public.alert_responses(volunteer_id);
CREATE INDEX idx_emergency_contacts_user_id ON public.emergency_contacts(user_id);

-- 7. Functions - MUST BE BEFORE RLS POLICIES
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'victim'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_nearby_volunteers(
    alert_lat DECIMAL,
    alert_lng DECIMAL,
    radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE(
    volunteer_id UUID,
    full_name TEXT,
    phone TEXT,
    distance_meters NUMERIC,
    skills TEXT[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        up.id,
        up.full_name,
        up.phone,
        ROUND(
            (6371000 * acos(
                cos(radians(alert_lat)) * 
                cos(radians(up.location_latitude)) * 
                cos(radians(up.location_longitude) - radians(alert_lng)) + 
                sin(radians(alert_lat)) * 
                sin(radians(up.location_latitude))
            ))::numeric, 0
        ) as distance_meters,
        up.skills
    FROM public.user_profiles up
    WHERE up.role = 'volunteer'
    AND up.volunteer_status = 'available'
    AND up.location_latitude IS NOT NULL
    AND up.location_longitude IS NOT NULL
    AND up.is_active = true
    AND (
        6371000 * acos(
            cos(radians(alert_lat)) * 
            cos(radians(up.location_latitude)) * 
            cos(radians(up.location_longitude) - radians(alert_lng)) + 
            sin(radians(alert_lat)) * 
            sin(radians(up.location_latitude))
        )
    ) <= COALESCE(up.availability_radius, radius_meters)
    ORDER BY distance_meters ASC
    LIMIT 50;
$$;

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies - Using Pattern 1 for user_profiles, Pattern 2 for others

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow volunteers to view other volunteers for coordination
CREATE POLICY "volunteers_view_other_volunteers"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
    role = 'volunteer' 
    AND EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() AND up.role IN ('volunteer', 'admin')
    )
);

-- Pattern 2: Simple user ownership for emergency_alerts
CREATE POLICY "users_manage_own_emergency_alerts"
ON public.emergency_alerts
FOR ALL
TO authenticated
USING (victim_id = auth.uid())
WITH CHECK (victim_id = auth.uid());

-- Allow volunteers to view alerts for response
CREATE POLICY "volunteers_view_emergency_alerts"
ON public.emergency_alerts
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() AND up.role IN ('volunteer', 'admin')
    )
);

-- Pattern 2: Simple user ownership for alert_responses
CREATE POLICY "volunteers_manage_own_alert_responses"
ON public.alert_responses
FOR ALL
TO authenticated
USING (volunteer_id = auth.uid())
WITH CHECK (volunteer_id = auth.uid());

-- Allow victims to view responses to their alerts
CREATE POLICY "victims_view_responses_to_their_alerts"
ON public.alert_responses
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.emergency_alerts ea 
        WHERE ea.id = alert_id AND ea.victim_id = auth.uid()
    )
);

-- Pattern 2: Simple user ownership for emergency_contacts
CREATE POLICY "users_manage_own_emergency_contacts"
ON public.emergency_contacts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 10. Triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_alerts_updated_at
    BEFORE UPDATE ON public.emergency_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 11. Complete Mock Data with Auth Users
DO $$
DECLARE
    victim_uuid UUID := gen_random_uuid();
    volunteer_uuid UUID := gen_random_uuid();
    admin_uuid UUID := gen_random_uuid();
    alert1_uuid UUID := gen_random_uuid();
    alert2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (victim_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'victim@resqnet.com', crypt('victim123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "victim"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (volunteer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'volunteer@resqnet.com', crypt('volunteer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Rodriguez", "role": "volunteer"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@resqnet.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Thompson", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with location and details
    UPDATE public.user_profiles 
    SET 
        phone = '+1 (555) 123-4567',
        location_latitude = 40.7128,
        location_longitude = -74.0060,
        address = '123 Main St, New York, NY 10001',
        role = 'victim'::public.user_role
    WHERE id = victim_uuid;

    UPDATE public.user_profiles 
    SET 
        phone = '+1 (555) 987-6543',
        location_latitude = 40.7589,
        location_longitude = -73.9851,
        address = '456 Oak Ave, New York, NY 10002',
        role = 'volunteer'::public.user_role,
        volunteer_status = 'available'::public.volunteer_status,
        skills = ARRAY['medical', 'search_rescue', 'first_aid'],
        availability_radius = 10000
    WHERE id = volunteer_uuid;

    UPDATE public.user_profiles 
    SET 
        phone = '+1 (555) 555-0123',
        location_latitude = 40.7505,
        location_longitude = -73.9934,
        address = '789 Admin Plaza, New York, NY 10003',
        role = 'admin'::public.user_role,
        volunteer_status = 'available'::public.volunteer_status,
        skills = ARRAY['management', 'coordination', 'medical']
    WHERE id = admin_uuid;

    -- Create sample emergency alerts
    INSERT INTO public.emergency_alerts (id, victim_id, emergency_type, title, description, latitude, longitude, address, status, priority_level) VALUES
        (alert1_uuid, victim_uuid, 'medical'::public.emergency_type, 'Medical Emergency', 'Person collapsed, needs immediate medical attention', 40.7128, -74.0060, '123 Main St, New York, NY', 'pending'::public.alert_status, 5),
        (alert2_uuid, victim_uuid, 'accident'::public.emergency_type, 'Car Accident', 'Multi-vehicle accident blocking intersection', 40.7614, -73.9776, 'Times Square, New York, NY', 'in_progress'::public.alert_status, 4);

    -- Create sample alert response
    INSERT INTO public.alert_responses (alert_id, volunteer_id, response_time, estimated_arrival, message, is_accepted) VALUES
        (alert1_uuid, volunteer_uuid, now(), 8, 'On my way, ETA 8 minutes', true);

    -- Create emergency contacts
    INSERT INTO public.emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES
        (victim_uuid, 'John Johnson', '+1 (555) 111-2222', 'Husband', true),
        (victim_uuid, 'Mary Smith', '+1 (555) 333-4444', 'Sister', false),
        (volunteer_uuid, 'Lisa Rodriguez', '+1 (555) 777-8888', 'Wife', true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;