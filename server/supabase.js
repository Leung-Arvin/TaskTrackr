require('dotenv').config();

const supa = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = supa.createClient(supabaseUrl, supabaseKey); 

module.exports = supabase;