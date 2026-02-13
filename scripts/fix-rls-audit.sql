-- ============================================
-- RLS AUDIT & FIX MIGRATION
-- ============================================
-- Fixes CRITICAL security warning: "RLS Disabled in Public"
-- Ensures ALL public tables have Row Level Security enabled
-- with appropriate policies.
--
-- Safe to run multiple times (idempotent).
-- ============================================

-- ============================================
-- 1. FIX: section_icon_suggestions
-- ============================================
-- This table was created without RLS.
-- Since it's not actively used by the application,
-- we enable RLS and only allow authenticated users
-- to read/write. Public (anon) access is denied.

ALTER TABLE IF EXISTS section_icon_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
DROP POLICY IF EXISTS "Section icons viewable by authenticated users" ON section_icon_suggestions;
CREATE POLICY "Section icons viewable by authenticated users"
  ON section_icon_suggestions FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage
DROP POLICY IF EXISTS "Section icons manageable by authenticated users" ON section_icon_suggestions;
CREATE POLICY "Section icons manageable by authenticated users"
  ON section_icon_suggestions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. AUDIT: Verify ALL tables have RLS enabled
-- ============================================
-- This query lists any remaining tables without RLS.
-- After running this migration, the result should be EMPTY.

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- ============================================
-- 3. SUMMARY: Show all RLS policies
-- ============================================
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
