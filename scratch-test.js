const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
  console.log('Testing insert...');
  const { data: newOrg, error: insertError } = await supabase
    .from('organizations')
    .insert([{
      name: 'Mi Empresa',
      // country: 'PE',
      // currency: 'USD'
    }])
    .select('*')
    .single();
  
  console.log('Insert Result:', newOrg, 'Error:', insertError);
}

test();
