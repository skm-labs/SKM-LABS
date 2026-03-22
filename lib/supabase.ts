// lib/supabase.ts
// Add to your .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ── Types ────────────────────────────────────────────────────────────────────

export interface ContactInsert {
  name:    string;
  email:   string;
  service: string;
  budget:  string;
  message: string;
}

export interface CommissionInsert {
  // Step 1
  name:           string;
  email:          string;
  handle:         string;
  // Step 2
  service:        string;
  description:    string;
  dimensions:     string;
  materials:      string;
  reference_urls: string[];
  // Step 3
  budget:         string;
  deadline:       string;   // ISO date string
  referral:       string;
}
