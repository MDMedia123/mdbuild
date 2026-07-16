// MD Media — shared Supabase config
// Loaded by every page that needs the database (home page, dashboard, admin panel).
// Only the anon key belongs here — it's safe for public/client-side use because
// every table it can touch is locked down by Row Level Security policies.
// The service_role key must NEVER be added to this file or any other file that
// ships to the browser.

var SUPABASE_URL = "https://taxibgjfospzfxeehfkl.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheGliZ2pmb3NwemZ4ZWVoZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTI4MDAsImV4cCI6MjA5OTQyODgwMH0.xM6vEuoR-0TTEKpOpMkM7s7jGMhdGNk9l8Q6dvF8N8I";

var mdSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
