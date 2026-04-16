-- ============================================================
-- TransRosa - Smart Transport Platform
-- Database Schema v1.0
-- Empresa de Transportes Santa Rosa de Vegueta S.A.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'dispatcher', 'driver', 'passenger');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'inactive', 'en_route');
CREATE TYPE driver_status AS ENUM ('available', 'driving', 'resting', 'off_duty', 'suspended');
CREATE TYPE trip_status AS ENUM ('scheduled', 'boarding', 'in_progress', 'completed', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('reserved', 'confirmed', 'used', 'cancelled', 'expired');
CREATE TYPE payment_method AS ENUM ('cash', 'yape', 'plin', 'card', 'transfer');
CREATE TYPE maintenance_type AS ENUM ('preventive', 'corrective', 'inspection');
CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'gnv');
CREATE TYPE trip_direction AS ENUM ('ida', 'vuelta');
CREATE TYPE alert_type AS ENUM ('warning', 'error', 'info', 'success');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'passenger',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROUTES
-- ============================================================

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,  -- 'RI-06'
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin_point GEOGRAPHY(POINT, 4326),
  destination_point GEOGRAPHY(POINT, 4326),
  distance_km NUMERIC(6,2) NOT NULL,
  return_distance_km NUMERIC(6,2) NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL,
  base_fare NUMERIC(6,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROUTE STOPS
-- ============================================================

CREATE TABLE route_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  stop_order INTEGER NOT NULL,
  direction trip_direction NOT NULL,
  is_terminal BOOLEAN NOT NULL DEFAULT false,
  estimated_time_from_start INTEGER, -- minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(route_id, direction, stop_order)
);

-- ============================================================
-- VEHICLES
-- ============================================================

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number TEXT NOT NULL UNIQUE,
  internal_number INTEGER NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 11,
  status vehicle_status NOT NULL DEFAULT 'active',
  soat_expiry DATE NOT NULL,
  technical_review_expiry DATE NOT NULL,
  last_maintenance DATE,
  next_maintenance DATE,
  odometer_km INTEGER NOT NULL DEFAULT 0,
  fuel fuel_type NOT NULL DEFAULT 'gasoline',
  gps_device_id TEXT UNIQUE,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DRIVERS
-- ============================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dni TEXT NOT NULL UNIQUE,
  license_number TEXT NOT NULL UNIQUE,
  license_category TEXT NOT NULL DEFAULT 'A-IIb',
  license_expiry DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  status driver_status NOT NULL DEFAULT 'available',
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  total_trips INTEGER NOT NULL DEFAULT 0,
  hire_date DATE NOT NULL,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIPS
-- ============================================================

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  direction trip_direction NOT NULL,
  scheduled_departure TIMESTAMPTZ NOT NULL,
  actual_departure TIMESTAMPTZ,
  scheduled_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status trip_status NOT NULL DEFAULT 'scheduled',
  passenger_count INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(8,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TICKETS
-- ============================================================

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  passenger_name TEXT,
  passenger_phone TEXT,
  seat_number INTEGER,
  fare NUMERIC(6,2) NOT NULL,
  fare_type TEXT NOT NULL DEFAULT 'regular', -- regular, student, senior, child
  status ticket_status NOT NULL DEFAULT 'confirmed',
  qr_code TEXT NOT NULL UNIQUE,
  payment payment_method NOT NULL DEFAULT 'cash',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ,

  CONSTRAINT valid_seat CHECK (seat_number >= 1 AND seat_number <= 10)
);

-- ============================================================
-- GPS TRACKING (Time-series data)
-- ============================================================

CREATE TABLE gps_positions (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  speed NUMERIC(5,1) NOT NULL DEFAULT 0,  -- km/h
  heading NUMERIC(5,1) NOT NULL DEFAULT 0, -- degrees
  trip_id UUID REFERENCES trips(id),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partition by time for performance (monthly partitions)
CREATE INDEX idx_gps_vehicle_time ON gps_positions (vehicle_id, recorded_at DESC);
CREATE INDEX idx_gps_trip ON gps_positions (trip_id) WHERE trip_id IS NOT NULL;

-- ============================================================
-- MAINTENANCE RECORDS
-- ============================================================

CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  type maintenance_type NOT NULL,
  priority maintenance_priority NOT NULL DEFAULT 'medium',
  status maintenance_status NOT NULL DEFAULT 'scheduled',
  description TEXT NOT NULL,
  mechanic TEXT,
  cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  parts_used TEXT[],
  odometer_at_service INTEGER,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  next_service_km INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DAILY REVENUE (Materialized/aggregated)
-- ============================================================

CREATE TABLE daily_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_trips INTEGER NOT NULL DEFAULT 0,
  total_passengers INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(10,2) NOT NULL DEFAULT 0,
  fuel_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  maintenance_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  other_costs NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_revenue NUMERIC(10,2) GENERATED ALWAYS AS (total_revenue - fuel_cost - maintenance_cost - other_costs) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type alert_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,  -- 'vehicle', 'driver', 'trip'
  entity_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FUEL RECORDS
-- ============================================================

CREATE TABLE fuel_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  liters NUMERIC(6,2) NOT NULL,
  cost_per_liter NUMERIC(6,2) NOT NULL,
  total_cost NUMERIC(8,2) NOT NULL,
  odometer_at_fill INTEGER NOT NULL,
  fuel_station TEXT,
  filled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_scheduled ON trips(scheduled_departure);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_tickets_trip ON tickets(trip_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_qr ON tickets(qr_code);
CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance_records(status);
CREATE INDEX idx_maintenance_scheduled ON maintenance_records(scheduled_date);
CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE is_read = false;
CREATE INDEX idx_fuel_vehicle ON fuel_records(vehicle_id);
CREATE INDEX idx_daily_revenue_date ON daily_revenue(date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin vehicles" ON vehicles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Admin drivers" ON drivers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Admin trips" ON trips FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'dispatcher'))
);

CREATE POLICY "Public ticket read" ON tickets FOR SELECT USING (true);
CREATE POLICY "Admin ticket write" ON tickets FOR INSERT USING (true);

CREATE POLICY "GPS read" ON gps_positions FOR SELECT USING (true);
CREATE POLICY "GPS insert" ON gps_positions FOR INSERT USING (true);

CREATE POLICY "Admin maintenance" ON maintenance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Alert read" ON alerts FOR SELECT USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_vehicles_timestamp BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_drivers_timestamp BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_trips_timestamp BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_maintenance_timestamp BEFORE UPDATE ON maintenance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Update trip revenue when ticket is sold
CREATE OR REPLACE FUNCTION update_trip_revenue()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE trips SET
      passenger_count = passenger_count + 1,
      revenue = revenue + NEW.fare
    WHERE id = NEW.trip_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_sold AFTER INSERT ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_trip_revenue();

-- Function: Check SOAT and review expiry alerts
CREATE OR REPLACE FUNCTION check_vehicle_alerts()
RETURNS void AS $$
DECLARE
  v RECORD;
BEGIN
  -- SOAT expiring in 30 days
  FOR v IN SELECT * FROM vehicles WHERE soat_expiry <= CURRENT_DATE + INTERVAL '30 days' AND status != 'inactive' LOOP
    INSERT INTO alerts (type, title, message, entity_type, entity_id)
    VALUES ('warning', 'SOAT por vencer',
      FORMAT('Vehículo #%s (%s) - SOAT vence el %s', v.internal_number, v.plate_number, v.soat_expiry),
      'vehicle', v.id)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Technical review expiring in 30 days
  FOR v IN SELECT * FROM vehicles WHERE technical_review_expiry <= CURRENT_DATE + INTERVAL '30 days' AND status != 'inactive' LOOP
    INSERT INTO alerts (type, title, message, entity_type, entity_id)
    VALUES ('warning', 'Revisión técnica por vencer',
      FORMAT('Vehículo #%s (%s) - Revisión vence el %s', v.internal_number, v.plate_number, v.technical_review_expiry),
      'vehicle', v.id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SEED DATA: Route RI-06
-- ============================================================

INSERT INTO routes (code, name, origin, destination, origin_point, destination_point, distance_km, return_distance_km, estimated_duration_minutes, base_fare)
VALUES (
  'RI-06',
  'Vegueta - Huacho',
  'Vegueta',
  'Huacho',
  ST_MakePoint(-77.6420, -11.0175)::geography,
  ST_MakePoint(-77.6089, -11.1075)::geography,
  21.67,
  21.48,
  45,
  3.50
);

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE gps_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE trips;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
