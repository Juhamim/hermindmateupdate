"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { XCircle, AlertTriangle } from "lucide-react";
import { Suspense } from "react";

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");

    // Determine content based on reason
    const isCancelled = reason === "cancelled";

    const title = isCancelled ? "Payment Cancelled" : "Payment Failed";
    const message = isCancelled
        ? "You cancelled the payment process. No charges were made."
        : "Something went wrong with your payment. Please try again or contact support if the issue persists.";

    const Icon = isCancelled ? AlertTriangle : XCircle;
    const iconColor = isCancelled ? "text-yellow-600 dark:text-yellow-500" : "text-red-600 dark:text-red-500";
    const bgColor = isCancelled ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-red-100 dark:bg-red-900/30";

    return (
        <div className="max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
                <div className={`rounded-full ${bgColor} p-4`}>
                    <Icon className={`w-16 h-16 ${iconColor}`} />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">
                    {message}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="w-full" asChild>
                    <Link href="/">Return Home</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <PaymentFailedContent />
            </Suspense>
        </div>
    );
}
