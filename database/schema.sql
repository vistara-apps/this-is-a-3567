-- Know Your Rights Buddy Database Schema
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
    state_preference TEXT,
    trusted_contacts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stripe_customer_id TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
    subscription_current_period_end TIMESTAMP WITH TIME ZONE,
    profile_data JSONB DEFAULT '{}'::jsonb
);

-- State Rights Guides table
CREATE TABLE public.state_rights_guides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    rights_info JSONB NOT NULL,
    scripts JSONB DEFAULT '{}'::jsonb,
    prohibitions JSONB DEFAULT '[]'::jsonb,
    state_specific_laws JSONB DEFAULT '{}'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true
);

-- Incident Records table
CREATE TABLE public.incident_records (
    record_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location JSONB,
    audio_url TEXT,
    video_url TEXT,
    ipfs_hash TEXT,
    notes TEXT,
    shared_with_contacts BOOLEAN DEFAULT false,
    incident_type TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts Library table
CREATE TABLE public.scripts_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scenario TEXT NOT NULL,
    state_code TEXT,
    script_content JSONB NOT NULL,
    language TEXT DEFAULT 'en',
    tier_required TEXT DEFAULT 'free' CHECK (tier_required IN ('free', 'basic', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0
);

-- User Generated Scripts table (AI-generated custom scripts)
CREATE TABLE public.user_scripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    scenario TEXT NOT NULL,
    state_code TEXT,
    script_content JSONB NOT NULL,
    ai_generated BOOLEAN DEFAULT true,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Events table (for Stripe webhook handling)
CREATE TABLE public.subscription_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Analytics table
CREATE TABLE public.usage_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Contacts table
CREATE TABLE public.emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    relationship TEXT,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);

CREATE INDEX idx_state_rights_guides_state_code ON public.state_rights_guides(state_code);
CREATE INDEX idx_state_rights_guides_active ON public.state_rights_guides(is_active);

CREATE INDEX idx_incident_records_user_id ON public.incident_records(user_id);
CREATE INDEX idx_incident_records_timestamp ON public.incident_records(timestamp);
CREATE INDEX idx_incident_records_incident_type ON public.incident_records(incident_type);

CREATE INDEX idx_scripts_library_scenario ON public.scripts_library(scenario);
CREATE INDEX idx_scripts_library_state_code ON public.scripts_library(state_code);
CREATE INDEX idx_scripts_library_tier ON public.scripts_library(tier_required);

CREATE INDEX idx_user_scripts_user_id ON public.user_scripts(user_id);
CREATE INDEX idx_user_scripts_scenario ON public.user_scripts(scenario);

CREATE INDEX idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX idx_subscription_events_processed ON public.subscription_events(processed);

CREATE INDEX idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_action_type ON public.usage_analytics(action_type);
CREATE INDEX idx_usage_analytics_created_at ON public.usage_analytics(created_at);

CREATE INDEX idx_emergency_contacts_user_id ON public.emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_active ON public.emergency_contacts(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_incident_records_updated_at
    BEFORE UPDATE ON public.incident_records
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_scripts_library_updated_at
    BEFORE UPDATE ON public.scripts_library
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_scripts_updated_at
    BEFORE UPDATE ON public.user_scripts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_emergency_contacts_updated_at
    BEFORE UPDATE ON public.emergency_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = user_id);

-- Incident records policies
CREATE POLICY "Users can view own incident records" ON public.incident_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incident records" ON public.incident_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incident records" ON public.incident_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incident records" ON public.incident_records
    FOR DELETE USING (auth.uid() = user_id);

-- User scripts policies
CREATE POLICY "Users can view own scripts" ON public.user_scripts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts" ON public.user_scripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts" ON public.user_scripts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts" ON public.user_scripts
    FOR DELETE USING (auth.uid() = user_id);

-- Emergency contacts policies
CREATE POLICY "Users can view own emergency contacts" ON public.emergency_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts" ON public.emergency_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts" ON public.emergency_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts" ON public.emergency_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for state guides and scripts library
CREATE POLICY "Anyone can view state rights guides" ON public.state_rights_guides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view scripts library" ON public.scripts_library
    FOR SELECT USING (is_active = true);

-- Usage analytics policies (insert only for users)
CREATE POLICY "Users can insert usage analytics" ON public.usage_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription events policies (service role only)
CREATE POLICY "Service role can manage subscription events" ON public.subscription_events
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for common operations

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION public.check_subscription_limit(
    user_uuid UUID,
    resource_type TEXT,
    tier_limits JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier TEXT;
    current_count INTEGER;
    tier_limit INTEGER;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier
    FROM public.users
    WHERE user_id = user_uuid;
    
    -- Get current usage count based on resource type
    CASE resource_type
        WHEN 'recordings' THEN
            SELECT COUNT(*) INTO current_count
            FROM public.incident_records
            WHERE user_id = user_uuid;
        WHEN 'trusted_contacts' THEN
            SELECT COUNT(*) INTO current_count
            FROM public.emergency_contacts
            WHERE user_id = user_uuid AND is_active = true;
        ELSE
            current_count := 0;
    END CASE;
    
    -- Get tier limit
    tier_limit := (tier_limits->user_tier->>resource_type)::INTEGER;
    
    -- Return true if under limit or unlimited (-1)
    RETURN tier_limit = -1 OR current_count < tier_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log usage analytics
CREATE OR REPLACE FUNCTION public.log_usage(
    user_uuid UUID,
    action TEXT,
    resource TEXT DEFAULT NULL,
    resource_id TEXT DEFAULT NULL,
    extra_data JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.usage_analytics (user_id, action_type, resource_type, resource_id, metadata)
    VALUES (user_uuid, action, resource, resource_id, extra_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
