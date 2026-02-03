"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { ChevronRight, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

const questions = [
    "I feel nervous or uneasy without a clear reason.",
    "I feel pressured to keep up with responsibilities.",
    "I have less interest in things I used to enjoy.",
    "I find it hard to stop my thoughts once they start.",
    "I feel uncomfortable when things are not “just right.”",
    "I worry about being judged by others.",
    "My emotions feel intense or overwhelming.",
    "My mind feels active when I try to sleep.",
    "I feel less motivated than before.",
    "I trust my ability to handle challenges."
];

const options = [
    { label: "Never", points: 0 },
    { label: "Sometimes", points: 1 },
    { label: "Often", points: 2 },
    { label: "Almost Always", points: 3 }
];

interface ResultCategory {
    label: string;
    description: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
}

const getResult = (score: number): ResultCategory => {
    if (score <= 4) return {
        label: "Doing Okay",
        description: "You seem to be managing well. Keep nurturing your mental well-being!",
        color: "text-green-600",
        bg: "bg-green-100 border-green-200",
        icon: <CheckCircle2 className="w-8 h-8 text-green-600" />
    };
    if (score <= 8) return {
        label: "Mild Strain",
        description: "You might be feeling a bit stressed. Consider taking some time for self-care.",
        color: "text-yellow-600",
        bg: "bg-yellow-100 border-yellow-200",
        icon: <AlertCircle className="w-8 h-8 text-yellow-600" />
    };
    if (score <= 12) return {
        label: "High Strain",
        description: "It feels like things are piling up. Speaking with a professional could really help.",
        color: "text-orange-600",
        bg: "bg-orange-100 border-orange-200",
        icon: <AlertCircle className="w-8 h-8 text-orange-600" />
    };
    return {
        label: "Very High Strain",
        description: "You're carrying a heavy load right now. We strongly recommend reaching out for support.",
        color: "text-red-600",
        bg: "bg-red-100 border-red-200",
        icon: <AlertCircle className="w-8 h-8 text-red-600" />
    };
};

export function FreeAssessment() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    // Track selected option index for current question to show UI feedback if needed (optional)

    const handleAnswer = (points: number) => {
        const newScore = score + points;
        if (currentQuestion < questions.length - 1) {
            setScore(newScore);
            setCurrentQuestion(prev => prev + 1);
        } else {
            setScore(newScore);
            setShowResult(true);
        }
    };

    const resetAssessment = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowResult(false);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const result = getResult(score);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            {!showResult && (
                <div className="mb-8 space-y-2">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Completed</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-foreground/20"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-transparent max-w-xl mx-auto"
                    >
                        <h3 className="font-sans text-2xl md:text-3xl text-foreground mb-12 leading-snug text-center">
                            {questions[currentQuestion]}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option.points)}
                                    className="w-full text-left p-6 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 flex items-center justify-between group"
                                >
                                    <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                                        {option.label}
                                    </span>
                                    <div className="w-2 h-2 rounded-full border border-foreground/20 group-hover:bg-primary group-hover:border-primary transition-all" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-transparent max-w-xl mx-auto text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
                                {result.icon}
                            </div>
                            <h2 className="font-sans text-4xl text-foreground">
                                Assessment Complete
                            </h2>
                            <div className={cn("inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider mt-2", result.bg, result.color)}>
                                {result.label}
                            </div>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                                {result.description}
                            </p>
                        </div>

                        <div className="pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={resetAssessment}
                                variant="outline"
                                className="border-border text-foreground hover:bg-secondary"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
                            </Button>
                            <Link href="https://calendar.app.google/sfbz8KEjeM12NBcM8">
                                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Book a Free Consultation
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
