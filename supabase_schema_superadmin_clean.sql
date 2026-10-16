-- ============================================================
-- VYLOGIX SUPER ADMIN — LEAN DATABASE SCHEMA (CONTROL PLANE)
-- Eksekusi file ini di SQL Editor pada project: db-superadmin
-- ============================================================

-- 1. Bersihkan tabel-tabel operasional tenant yang tidak dipakai di Control Plane
DROP TABLE IF EXISTS maintenance_tickets CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS agency_sheet_configs CASCADE;
DROP TABLE IF EXISTS fin_transactions CASCADE;
DROP TABLE IF EXISTS fin_invoice_items CASCADE;
DROP TABLE IF EXISTS fin_invoices CASCADE;
DROP TABLE IF EXISTS fin_categories CASCADE;
DROP TABLE IF EXISTS internal_notes CASCADE;
DROP TABLE IF EXISTS project_revisions CASCADE;
DROP TABLE IF EXISTS project_assets CASCADE;
DROP TABLE IF EXISTS project_physical_details CASCADE;
DROP TABLE IF EXISTS project_digital_details CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS agency_services CASCADE;

-- 2. Pastikan Tabel Inti Master Platform ada
CREATE TABLE IF NOT EXISTS organizations (
    id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name                TEXT        NOT NULL,
    slug                TEXT        UNIQUE,
    is_active           BOOLEAN     DEFAULT true,
    auto_suspend        BOOLEAN     DEFAULT false,
    license_expires_at  TIMESTAMPTZ DEFAULT NULL,
    tagline             TEXT        DEFAULT NULL,
    logo_url            TEXT        DEFAULT NULL,
    webhook_url         TEXT        DEFAULT NULL,
    log_retention_days  INTEGER     DEFAULT 30,
    whatsapp_number     TEXT        DEFAULT NULL,
    industry_type       TEXT        DEFAULT 'DIGITAL',
    qris_image_url      TEXT        DEFAULT NULL,
    module_digital      BOOLEAN     DEFAULT true,
    module_physical     BOOLEAN     DEFAULT false,
    custom_asset_categories TEXT[]  DEFAULT ARRAY['Logo & Branding', 'Font & Tipografi', 'Desain Siap Cetak', 'Dokumen & Copywriting', 'Gambar Konten Web/App', 'Lainnya']::TEXT[],
    created_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    id              UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT    NOT NULL,
    full_name       TEXT,
    role            TEXT    DEFAULT 'super_admin',
    organization_id UUID    REFERENCES organizations(id) ON DELETE SET NULL,
    whatsapp_number TEXT    DEFAULT NULL,
    address         TEXT    DEFAULT NULL,
    supplier_goods  TEXT    DEFAULT NULL,
    created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID        REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id        UUID,
    actor_email     TEXT,
    action          TEXT        NOT NULL,
    target_type     TEXT,
    target_id       TEXT,
    target_name     TEXT,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger untuk User Baru Auth Supabase -> Profiles Super Admin
CREATE OR REPLACE FUNCTION public.handle_new_superadmin_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Super Admin'),
        'super_admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_superadmin_user();

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy Sederhana Super Admin
DROP POLICY IF EXISTS "Superadmin Akses Penuh Orgs" ON organizations;
CREATE POLICY "Superadmin Akses Penuh Orgs" ON organizations FOR ALL USING (true);

DROP POLICY IF EXISTS "Superadmin Akses Penuh Profiles" ON profiles;
CREATE POLICY "Superadmin Akses Penuh Profiles" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Superadmin Akses Penuh Audit" ON audit_logs;
CREATE POLICY "Superadmin Akses Penuh Audit" ON audit_logs FOR ALL USING (true);
