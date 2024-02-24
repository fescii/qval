const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env['SUPABASE_URL'],
  process.env['SUPABASE_ANON_KEY'], {
    autoRefreshToken: true, // Set this based on your requirements
    cleanupStorage: false // Disable cleanup of empty folders after upload
  }
);


module.exports = {
  supabase
}