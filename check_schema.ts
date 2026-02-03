
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSchema() {
    const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .limit(1);

    if (error) {
        console.error(error);
    } else if (data && data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
        console.log("Sample Row:", data[0]);
    } else {
        console.log("Table is empty or no rights to see schema.");
    }
}

checkSchema();
