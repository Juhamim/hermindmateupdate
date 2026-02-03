import { Brain, Heart, Sparkles, Baby, Users, Shield, Flag, Briefcase } from "lucide-react";

export const SERVICES_LIST = [
    {
        title: "General psychological conditions",
        description: "Expert support for anxiety, depression, and mood regulation.",
        image: "/services/generalpsychologic.png",
        icon: Brain,
        color: "bg-[#e8f4f8]",
        textColor: "text-[#5b8c9b]"
    },
    {
        title: "Relationship counselling",
        description: "Navigate complexities in relationships and foster deeper connections.",
        image: "/services/relationship.png",
        icon: Heart,
        color: "bg-[#fcecef]",
        textColor: "text-[#d67c8c]"
    },
    {
        title: "Personality Disorder counselling",
        description: "Specialized care for understanding and managing personality spectrums.",
        image: "/services/personality.png",
        icon: Sparkles,
        color: "bg-[#fbf7e8]",
        textColor: "text-[#c2a456]"
    },
    {
        title: "Child and adolescent counselling",
        description: "Safe space for young minds to grow, heal, and express themselves.",
        image: "/services/teens.png", // Child playing/smiling
        icon: Baby,
        color: "bg-[#e8f8f3]",
        textColor: "text-[#6aa892]"
    },
    {
        title: "Pregnancy and postpartum support",
        description: "Compassionate care during the transformative journey of motherhood.",
        image: "/services/postpartum.png", // Pregnant woman
        icon: Users, // Using Users as a proxy for family/parenting
        color: "bg-[#f3e8f8]",
        textColor: "text-[#9d7cb5]"
    },
    {
        title: "Sexual health and intimate hygiene",
        description: "Awareness and counseling for a healthy relationship with your body.",
        image: "/services/intimate.png", // Soft flowers
        icon: Shield,
        color: "bg-[#fbe8e8]",
        textColor: "text-[#d66a6a]"
    },
    {
        title: "Gender identity and queer affirmative",
        description: "Affirmative counseling celebrating your authentic self.",
        image: "/services/queer.PNG",
        icon: Flag,
        color: "bg-[#e8eaf8]",
        textColor: "text-[#6a7ad6]"
    },
    {
        title: "Work life balance",
        description: "Strategies for occupational wellbeing and preventing burnout.",
        image: "/services/work.PNG",
        icon: Briefcase,
        color: "bg-[#edf8e8]",
        textColor: "text-[#7ad66a]"
    }
];
