-- ============================================================
-- TransRosa - Partners, Commissions & Compliance
-- Migration 002
-- Empresa de Transportes Santa Rosa de Vegueta S.A.
-- Business Model: 50 socios, each owns 2 vehicles (100 total)
-- ============================================================

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE partner_status AS ENUM ('active', 'suspended', 'inactive');

CREATE TYPE commission_period AS ENUM ('daily', 'monthly', 'annual');
CREATE TYPE commission_status AS ENUM ('paid', 'pending', 'overdue', 'partial');

CREATE TYPE compliance_type AS ENUM ('soat', 'technical_review', 'vehicle_card', 'route_permit', 'driver_license', 'medical_cert', 'background_check', 'insurance');
CREATE TYPE compliance_doc_status AS ENUM ('valid', 'expiring_soon', 'expired', 'missing');

-- ============================================================
-- PARTNERS / SOCIOS
-- ============================================================

CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  partner_number INTEGER NOT NULL UNIQUE CHECK (partner_number BETWEEN 1 AND 100),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dni TEXT NOT NULL UNIQUE,
  ruc TEXT UNIQUE,
  phone TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  address TEXT,
  status partner_status NOT NULL DEFAULT 'active',
  join_date DATE NOT NULL,
  is_driver BOOLEAN NOT NULL DEFAULT false,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ALTER VEHICLES: Add partner ownership
-- ============================================================

ALTER TABLE vehicles ADD COLUMN partner_id UUID REFERENCES partners(id);
CREATE INDEX idx_vehicles_partner ON vehicles(partner_id);

-- ============================================================
-- COMMISSIONS
-- ============================================================

CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  vehicle_id UUID REFERENCES vehicles(id),
  period commission_period NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status commission_status NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method payment_method,
  receipt_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMPLIANCE / DOCUMENT TRACKING
-- ============================================================

CREATE TABLE compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vehicle', 'driver')),
  entity_id UUID NOT NULL,
  partner_id UUID NOT NULL REFERENCES partners(id),
  type compliance_type NOT NULL,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE NOT NULL,
  status compliance_doc_status NOT NULL DEFAULT 'valid',
  document_url TEXT,
  notes TEXT,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, type)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_commissions_partner ON commissions(partner_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_due ON commissions(due_date);
CREATE INDEX idx_compliance_entity ON compliance_records(entity_type, entity_id);
CREATE INDEX idx_compliance_partner ON compliance_records(partner_id);
CREATE INDEX idx_compliance_expiry ON compliance_records(expiry_date);
CREATE INDEX idx_compliance_status ON compliance_records(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin partners" ON partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admin commissions" ON commissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admin compliance" ON compliance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_partners_timestamp BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE commissions;
ALTER PUBLICATION supabase_realtime ADD TABLE compliance_records;

-- ============================================================
-- FUNCTION: Auto-update compliance status based on expiry
-- ============================================================

CREATE OR REPLACE FUNCTION update_compliance_status()
RETURNS void AS $$
BEGIN
  UPDATE compliance_records SET status = 'expired' WHERE expiry_date < CURRENT_DATE AND status != 'expired';
  UPDATE compliance_records SET status = 'expiring_soon' WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' AND status = 'valid';
END;
$$ LANGUAGE plpgsql;
