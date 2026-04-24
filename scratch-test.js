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
  const typesToTest = ['machine', 'labor', 'assembly', 'quality', 'manual', 'Manual'];

  for (const t of typesToTest) {
    console.log(`Testing type: ${t}`);
    const { error } = await supabase.from('work_centers').insert([{ 
      organization_id: orgId, 
      name: `Test ${t}`, 
      type: t,
      attributes: {}
    }]);
    if (error) {
      console.log(`  Error: ${error.message}`);
    } else {
      console.log(`  Success!`);
      // Cleanup
      await supabase.from('work_centers').delete().eq('name', `Test ${t}`);
    }
  }
}

main();
