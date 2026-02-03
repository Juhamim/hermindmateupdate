
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const specialists = [
    // --- Clinical Psychologists ---
    {
        name: "Anusree PR",
        title: "Clinical psychologist",
        years_of_experience: 5,
        specializations: ["Anxiety", "Depression", "Trauma", "Clinical Disorders"],
        education: ["MPhil Clinical Psychology"],
        price: 1500,
        categories: ["clinical"]
    },
    {
        name: "Anjala Anilkumar",
        title: "Clinical psychologist",
        years_of_experience: 5,
        specializations: ["Anxiety", "Relationship", "Stress Management"],
        education: ["MPhil Clinical Psychology"],
        price: 1500,
        categories: ["clinical"]
    },
    {
        name: "Zakhariya SV",
        title: "Clinical psychologist",
        years_of_experience: 3,
        specializations: ["Addiction", "Mooed Disorders", "Adolescent Issues"],
        education: ["MPhil Clinical Psychology"],
        price: 1200,
        categories: ["clinical"]
    },
    {
        name: "Sreelakshmi VP",
        title: "Clinical psychologist",
        years_of_experience: 2,
        specializations: ["Child Psychology", "Learning Disabilities"],
        education: ["MPhil Clinical Psychology"],
        price: 1200,
        categories: ["clinical"]
    },

    // --- Consultant Psychologists ---
    {
        name: "Sangili Krishna",
        title: "Consultant Psychologist (PhD Scholar)",
        years_of_experience: 3,
        specializations: ["Consulting", "Research", "Adult Therapy"],
        education: ["PhD Scholar", "MSc Psychology"],
        price: 1000,
        categories: ["consultant"]
    },
    {
        name: "Reshma Thomas",
        title: "Consultant Psychologist",
        years_of_experience: 5,
        specializations: ["Family Therapy", "Couples Counseling"],
        education: ["MSc Psychology"],
        price: 1000,
        categories: ["consultant"]
    },
    {
        name: "Nisha CT",
        title: "Consultant Psychologist",
        years_of_experience: 5,
        specializations: ["Premarital Counseling", "Relationship", "Emotional Wellbeing"],
        education: ["MSc Psychology"],
        price: 900,
        categories: ["consultant"]
    },
    {
        name: "Anjitha Nirmal",
        title: "Consultant Psychologist",
        years_of_experience: 4,
        specializations: ["Stress", "Work-Life Balance"],
        education: ["MSc Psychology"],
        price: 900,
        categories: ["consultant"]
    },
    {
        name: "Najih Abdul Nazer",
        title: "Consultant Psychologist",
        years_of_experience: 4,
        specializations: ["General Counseling", "Men's Mental Health"],
        education: ["MSc Psychology"],
        price: 900,
        categories: ["consultant"]
    },
    {
        name: "Aisha Hamna",
        title: "Consultant Psychologist (Intern)",
        years_of_experience: 4,
        specializations: ["Student Counseling", "Anxiety"],
        education: ["MSc Psychology"],
        price: 500,
        categories: ["consultant"]
    },
    {
        name: "Prinsina",
        title: "Consultant Psychologist (Intern)",
        years_of_experience: 3,
        specializations: ["Child Support", "Parenting"],
        education: ["MSc Psychology"],
        price: 500,
        categories: ["consultant"]
    },
    {
        name: "Hibamol K",
        title: "Consultant Psychologist",
        years_of_experience: 2,
        specializations: ["Early Adult Issues", "Career"],
        education: ["MSc Psychology"],
        price: 800,
        categories: ["consultant"]
    },
    {
        name: "U Noorul Nasrat",
        title: "Consultant Psychologist",
        years_of_experience: 2,
        specializations: ["General Therapy"],
        education: ["MSc Psychology"],
        price: 800,
        categories: ["consultant"]
    },
    {
        name: "Anne mary Davis",
        title: "Consultant Psychologist",
        years_of_experience: 2,
        specializations: ["Grief", "Loss"],
        education: ["MSc Psychology"],
        price: 800,
        categories: ["consultant"]
    },
    {
        name: "Sneha Rajeev",
        title: "Consultant Psychologist",
        years_of_experience: 2,
        specializations: ["Self-Esteem", "Confidence"],
        education: ["MSc Psychology"],
        price: 800,
        categories: ["consultant"]
    },
    {
        name: "Aiswaryalakshmi S",
        title: "Consultant Psychologist",
        years_of_experience: 2,
        specializations: ["Stress", "Study Skills"],
        education: ["MSc Psychology"],
        price: 800,
        categories: ["consultant"]
    },
    {
        name: "Shagun Raghuwanshi",
        title: "Consultant Psychologist",
        years_of_experience: 1,
        specializations: ["General Counseling"],
        education: ["MSc Psychology"],
        price: 600,
        categories: ["consultant"]
    },

    // --- Ayurvedic & Gynecological ---
    {
        name: "Dr Raksha Suvarna",
        title: "Ayurvedic Consultant & Gynecologist",
        years_of_experience: 10,
        specializations: ["Ayurvedic", "Gynecology", "Women's Health"],
        education: ["BAMS", "MD (Ayurveda)"],
        price: 1200,
        categories: ["ayurvedic"]
    },
    {
        name: "Dr Athira Kumaran",
        title: "Ayurvedic Consultant",
        years_of_experience: 9,
        specializations: ["Ayurvedic", "Holistic Health"],
        education: ["BAMS"],
        price: 1100,
        categories: ["ayurvedic"]
    },

    // --- Yoga Specialists ---
    {
        name: "Dr Rajasuya",
        title: "Yoga Specialist",
        years_of_experience: 4,
        specializations: ["Yoga", "Meditation", "Mindfulness"],
        education: ["BNYS" || "PhD Yoga"],
        price: 800,
        categories: ["yoga"]
    },
    {
        name: "Sreeja Mohan",
        title: "Yoga Specialist",
        years_of_experience: 4,
        specializations: ["Yoga", "Wellness"],
        education: ["Certified Yoga Instructor"],
        price: 800,
        categories: ["yoga"]
    }
];

async function seed() {
    console.log(`Seeding ${specialists.length} specialists...`);

    for (const p of specialists) {
        // Check if exists
        const { data: existing } = await supabase
            .from('psychologists')
            .select('id')
            .ilike('name', p.name)
            .single();

        if (existing) {
            console.log(`Updating ${p.name}...`);
            const { error } = await supabase
                .from('psychologists')
                .update({
                    title: p.title,
                    years_of_experience: p.years_of_experience,
                    specializations: p.specializations,
                    education: p.education,
                    price: p.price,
                    // Keep existing ID/Photo/Bio if not updating
                })
                .eq('id', existing.id);

            if (error) console.error(`Failed to update ${p.name}:`, error);
        } else {
            console.log(`Inserting ${p.name}...`);
            const { error } = await supabase
                .from('psychologists')
                .insert({
                    name: p.name,
                    title: p.title,
                    years_of_experience: p.years_of_experience,
                    specializations: p.specializations,
                    education: p.education,
                    price: p.price,
                    bio: `${p.name} is a dedicated ${p.title} with over ${p.years_of_experience} years of experience in ${p.specializations.join(', ')}.`,
                    availability: "Mon-Fri",
                    image_url: "https://placehold.co/400x400?text=" + encodeURIComponent(p.name.split(' ')[0]), // Placeholder
                    location: "Online",
                    languages: ["English", "Malayalam"]
                });

            if (error) console.error(`Failed to insert ${p.name}:`, error);
        }
    }
    console.log("Seeding complete.");
}

seed();
