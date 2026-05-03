-- ============================================================
-- TransRosa - Security Module Migration
-- Passenger Check-In, Manifests, Incidents, CCTV
-- ============================================================

CREATE TYPE check_in_method AS ENUM ('facial_recognition', 'qr_code', 'dni_scan', 'manual');
CREATE TYPE check_in_status AS ENUM ('checked_in', 'boarded', 'completed', 'no_show');
CREATE TYPE incident_type AS ENUM ('theft', 'assault', 'harassment', 'medical_emergency', 'vehicle_breakdown', 'accident', 'suspicious_behavior', 'lost_item', 'other');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('reported', 'investigating', 'police_notified', 'resolved', 'closed');
CREATE TYPE camera_status AS ENUM ('online', 'offline', 'maintenance', 'recording');
CREATE TYPE camera_location AS ENUM ('terminal_entry', 'terminal_boarding', 'vehicle_interior', 'vehicle_front', 'parking_lot');
CREATE TYPE sos_status AS ENUM ('active', 'responded', 'resolved', 'false_alarm');

-- Terminals
CREATE TABLE terminals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  district TEXT NOT NULL,
  has_facial_recognition BOOLEAN DEFAULT true,
  has_dni_scanner BOOLEAN DEFAULT true,
  cctv_camera_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Passenger Check-Ins
CREATE TABLE passenger_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  ticket_id UUID REFERENCES tickets(id),
  passenger_name TEXT NOT NULL,
  passenger_dni TEXT NOT NULL,
  passenger_phone TEXT,
  passenger_photo_url TEXT,
  method check_in_method NOT NULL,
  terminal_id UUID NOT NULL REFERENCES terminals(id),
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  boarding_time TIMESTAMPTZ,
  seat_number INTEGER,
  identity_verified BOOLEAN DEFAULT false,
  match_confidence NUMERIC(4,3),
  camera_id UUID,
  camera_snapshot_url TEXT,
  status check_in_status NOT NULL DEFAULT 'checked_in',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CCTV Cameras
CREATE TABLE cctv_cameras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camera_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location camera_location NOT NULL,
  terminal_id UUID REFERENCES terminals(id),
  vehicle_id UUID REFERENCES vehicles(id),
  has_facial_recognition BOOLEAN DEFAULT false,
  has_motion_detection BOOLEAN DEFAULT true,
  has_night_vision BOOLEAN DEFAULT false,
  resolution TEXT NOT NULL DEFAULT '1080p',
  storage_days INTEGER DEFAULT 30,
  status camera_status NOT NULL DEFAULT 'recording',
  last_ping TIMESTAMPTZ,
  last_recording_url TEXT,
  installed_date DATE NOT NULL,
  ip_address TEXT,
  notes TEXT,
  CHECK ((terminal_id IS NOT NULL) OR (vehicle_id IS NOT NULL))
);

-- Security Incidents
CREATE TABLE security_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_number TEXT NOT NULL UNIQUE,
  type incident_type NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'medium',
  status incident_status NOT NULL DEFAULT 'reported',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  reported_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  trip_id UUID REFERENCES trips(id),
  terminal_id UUID REFERENCES terminals(id),
  reported_by TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  affected_passengers UUID[] DEFAULT ARRAY[]::UUID[],
  suspect_description TEXT,
  suspect_photo_url TEXT,
  cctv_video_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  photo_evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  witness_statements TEXT[] DEFAULT ARRAY[]::TEXT[],
  police_notified BOOLEAN DEFAULT false,
  police_report_number TEXT,
  police_officer TEXT,
  resolution_notes TEXT,
  resolved_date TIMESTAMPTZ,
  insurance_claim_number TEXT,
  estimated_loss NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SOS Alerts
CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  triggered_by TEXT NOT NULL CHECK (triggered_by IN ('driver', 'passenger', 'auto')),
  user_id UUID REFERENCES profiles(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  trip_id UUID REFERENCES trips(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  status sos_status NOT NULL DEFAULT 'active',
  description TEXT,
  responder TEXT
);

-- Indexes
CREATE INDEX idx_check_ins_trip ON passenger_check_ins(trip_id);
CREATE INDEX idx_check_ins_vehicle ON passenger_check_ins(vehicle_id);
CREATE INDEX idx_check_ins_dni ON passenger_check_ins(passenger_dni);
CREATE INDEX idx_check_ins_time ON passenger_check_ins(check_in_time DESC);
CREATE INDEX idx_check_ins_terminal ON passenger_check_ins(terminal_id);
CREATE INDEX idx_cameras_status ON cctv_cameras(status);
CREATE INDEX idx_cameras_terminal ON cctv_cameras(terminal_id);
CREATE INDEX idx_incidents_status ON security_incidents(status);
CREATE INDEX idx_incidents_severity ON security_incidents(severity);
CREATE INDEX idx_incidents_date ON security_incidents(incident_date DESC);
CREATE INDEX idx_incidents_vehicle ON security_incidents(vehicle_id);
CREATE INDEX idx_sos_status ON sos_alerts(status);
CREATE INDEX idx_sos_triggered ON sos_alerts(triggered_at DESC);

-- RLS
ALTER TABLE terminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cctv_cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public terminals" ON terminals FOR SELECT USING (true);
CREATE POLICY "Admin check-ins" ON passenger_check_ins FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'dispatcher'))
);
CREATE POLICY "Admin cameras" ON cctv_cameras FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admin incidents" ON security_incidents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "SOS read" ON sos_alerts FOR SELECT USING (true);
CREATE POLICY "SOS insert" ON sos_alerts FOR INSERT USING (true);

-- Trigger for incidents
CREATE TRIGGER update_incidents_timestamp BEFORE UPDATE ON security_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE passenger_check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE security_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE cctv_cameras;

-- Auto-generate incident number
CREATE OR REPLACE FUNCTION generate_incident_number()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  next_num INTEGER;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SPLIT_PART(incident_number, '-', 3) AS INTEGER)), 0) + 1
  INTO next_num FROM security_incidents WHERE incident_number LIKE 'INC-' || year_str || '-%';
  NEW.incident_number := 'INC-' || year_str || '-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_incident_number BEFORE INSERT ON security_incidents
  FOR EACH ROW WHEN (NEW.incident_number IS NULL)
  EXECUTE FUNCTION generate_incident_number();

-- Seed terminals
INSERT INTO terminals (code, name, address, location, district, cctv_camera_count) VALUES
  ('term-vegueta', 'Terminal Vegueta', 'Av. 200 Millas cdra. 1', ST_MakePoint(-77.6420, -11.0175)::geography, 'Vegueta', 6),
  ('term-huacho', 'Terminal Huacho', 'Av. Luna Arrieta / Ca. Miguel Grau', ST_MakePoint(-77.6089, -11.1075)::geography, 'Huacho', 6);
