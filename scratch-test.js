const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const orgId = '74f62958-8bb2-4691-9965-609f7ba334e9';

  // Get a real product id
  const products = await supabase.from('products').select('id').limit(1);
  const productId = products.data[0].id;
  console.log('Using product id:', productId);

  // Test manufacturing_orders with real uuid
  const mo1 = await supabase.from('manufacturing_orders').insert([{ organization_id: orgId, product_id: productId, quantity_planned: 1 }]).select();
  console.log('manufacturing_orders insert:', mo1.error ? mo1.error : 'success');
  
  if (mo1.data && mo1.data[0]) {
    console.log('manufacturing_orders actual columns:', Object.keys(mo1.data[0]));
    await supabase.from('manufacturing_orders').delete().eq('id', mo1.data[0].id);
  }
}

main();
