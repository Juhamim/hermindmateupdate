
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPsychologists() {
    const { data, error } = await supabase.from('psychologists').select('*');
    if (error) {
        console.error('Error fetching:', error);
    } else {
        console.log(`Found ${data.length} psychologists:`);
        data.forEach(p => console.log(`- ${p.name} (${p.id})`));
    }
}

checkPsychologists();
