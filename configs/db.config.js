const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env['SUPABASE_URL'],
  process.env['SUPABASE_KEY']
);


module.exports = {
  supabase
}