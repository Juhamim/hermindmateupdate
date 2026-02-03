
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Or service role if needed, but anon should work for Select

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecs() {
    const { data, error } = await supabase.from('psychologists').select('name, specializations');
    if (error) {
        console.error(error);
        return;
    }

    console.log("Total Psychologists:", data.length);
    const allSpecs = new Set();
    data.forEach(p => {
        console.log(`\nName: ${p.name}`);
        console.log(`Specs: ${JSON.stringify(p.specializations)}`);
        p.specializations?.forEach(s => allSpecs.add(s));
    });

    console.log("\nUnique Specializations in DB:");
    console.log(Array.from(allSpecs).sort());
}

checkSpecs();
