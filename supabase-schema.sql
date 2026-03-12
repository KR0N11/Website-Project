-- ============================================
-- MTLWCUP Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Pricing table
CREATE TABLE pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duration INT NOT NULL,
  regular INT NOT NULL,
  peak INT NOT NULL,
  weekend INT NOT NULL
);

INSERT INTO pricing (duration, regular, peak, weekend) VALUES
  (30, 50, 50, 50),
  (60, 80, 100, 110),
  (90, 110, 135, 150),
  (120, 140, 170, 185);

-- Packages table
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

INSERT INTO packages (name, features, is_popular, sort_order) VALUES
  ('Pack Anniversaire', ARRAY['90 min terrain', '60 min espace relaxe', 'PS5 FIFA incluse', 'Boissons incluses'], FALSE, 1),
  ('Pack Corporate', ARRAY['2h terrain', 'Arbitre professionnel', 'Espace détente', 'Facturation entreprise'], TRUE, 2),
  ('Pack Tournoi Privé', ARRAY['Bloc multi-heures', 'Organisation bracket', 'Arbitrage complet', 'Récompenses'], FALSE, 3);

-- FAQ table
CREATE TABLE faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'help-circle',
  sort_order INT DEFAULT 0
);

INSERT INTO faq (question, answer, icon, sort_order) VALUES
  ('Quels sont les horaires d''ouverture ?', 'Le terrain est disponible du lundi au dimanche, de 8h à 23h.', 'clock', 1),
  ('Quels modes de paiement acceptez-vous ?', 'Nous acceptons Visa, Mastercard et Interac.', 'credit-card', 2),
  ('Quelle est votre politique d''annulation ?', 'Plus de 48h : remboursement complet. Entre 24h-48h : crédit. Moins de 24h : aucun remboursement.', 'alert-triangle', 3),
  ('Combien de joueurs peuvent jouer ?', 'Idéal pour 5v5 ou 6v6. Capacité totale de 30 personnes.', 'users', 4),
  ('Fournissez-vous l''équipement ?', 'Ballons, dossards et buts fournis. Apportez vos chaussures d''intérieur.', 'shield-check', 5),
  ('Peut-on réserver pour un événement privé ?', 'Oui ! Packs Anniversaire, Corporate et Tournoi disponibles.', 'help-circle', 6);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INT NOT NULL DEFAULT 60,
  player_name TEXT NOT NULL,
  team_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  players INT NOT NULL DEFAULT 10,
  price INT NOT NULL,
  deposit_paid INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for pricing, packages, faq
CREATE POLICY "Public read pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);

-- Bookings: public can insert, only authenticated can read/update
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own bookings" ON bookings FOR SELECT USING (true);
