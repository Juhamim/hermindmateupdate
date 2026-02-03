
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log("Checking database...");
    console.log("URL:", supabaseUrl);

    const { data, error } = await supabase
        .from('psychologists')
        .select('name, title, years_of_experience, specializations');

    if (error) {
        console.error("Error fetching psychologists:", error);
        return;
    }

    console.log(`Found ${data.length} psychologists:`);
    data.forEach(p => {
        console.log(`- ${p.name} (${p.title}) | ${p.years_of_experience} yrs | Specs: ${p.specializations}`);
    });
}

checkDatabase();
