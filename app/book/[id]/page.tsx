"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { DateSelection } from "@/app/components/features/DateSelection";
import { ArrowLeft, Check, CreditCard, Loader2 } from "lucide-react";
import { notFound, useRouter, useParams } from "next/navigation";
import Script from "next/script";
import { getPsychologistById, Psychologist } from "@/app/lib/actions/psychologists";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function BookingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [psychologist, setPsychologist] = useState<any | null>(null);
    const [isLoadingPsychologist, setIsLoadingPsychologist] = useState(true);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState<{
        date?: Date;
        time?: string;
        name: string;
        email: string;
        phone: string;
        countryCode: string;
        jobStatus: string;
        physicallyChallenged: string; // "yes" | "no"
        gender: string;
    }>({ name: "", email: "", phone: "", countryCode: "+91", jobStatus: "", physicallyChallenged: "", gender: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; jobStatus?: string; physicallyChallenged?: string; gender?: string }>({});

    // Step 4: Consent State
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [consentData, setConsentData] = useState({
        name: "",
        signature: "",
        date: "",
        agreed: false
    });

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === "name") {
            if (!value.trim()) error = "Name is required";
            else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        }
        if (name === "email") {
            if (!value.trim()) error = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        }
        if (name === "phone") {
            if (!value.trim()) error = "Phone number is required";
            else if (!/^\+?[0-9]{7,15}$/.test(value)) error = "Invalid phone number (min 7 digits)";
        }
        if (name === "jobStatus") {
            if (!value) error = "Job status is required";
        }
        if (name === "physicallyChallenged") {
            if (!value) error = "This field is required";
        }
        if (name === "gender") {
            if (!value) error = "Gender is required";
        }
        return error;
    };

    useEffect(() => {
        const fetchPsychologist = async () => {
            setIsLoadingPsychologist(true);
            try {
                const data = await getPsychologistById(id);
                setPsychologist(data);
            } catch (error) {
                console.error("Error fetching psychologist:", error);
            } finally {
                setIsLoadingPsychologist(false);
            }
        };

        if (id) {
            fetchPsychologist();
        }
    }, [id]);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!psychologist?.id) return;

            setIsLoadingSlots(true);
            try {
                const { getBookedSlots } = await import("@/app/lib/actions/bookings");

                // Get slots for the next 7 days
                const today = new Date();
                const endDate = new Date(today);
                endDate.setDate(today.getDate() + 7);

                const slots = await getBookedSlots(psychologist.id, today, endDate);
                setBookedSlots(slots);
            } catch (error) {
                console.error("Error fetching booked slots:", error);
                setBookedSlots([]); // On error, assume no slots are booked
            } finally {
                setIsLoadingSlots(false);
            }
        };

        if (psychologist?.id) {
            fetchBookedSlots();
        }
    }, [psychologist?.id]);

    const handleDateSelect = (date: Date, time: string) => {
        setBookingData(prev => ({ ...prev, date, time }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));

        // Dynamic validation
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error || undefined
        }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (!bookingData.date || !bookingData.time) return;
            setStep(prev => prev + 1);
        } else if (step === 2) {
            // Validate all fields
            const nameError = validateField("name", bookingData.name);
            const emailError = validateField("email", bookingData.email);
            const phoneError = validateField("phone", bookingData.phone);
            const jobStatusError = validateField("jobStatus", bookingData.jobStatus);
            const physicallyChallengedError = validateField("physicallyChallenged", bookingData.physicallyChallenged);
            const genderError = validateField("gender", bookingData.gender);

            if (nameError || emailError || phoneError || jobStatusError || physicallyChallengedError || genderError) {
                setErrors({
                    name: nameError || undefined,
                    email: emailError || undefined,
                    phone: phoneError || undefined,
                    jobStatus: jobStatusError || undefined,
                    physicallyChallenged: physicallyChallengedError || undefined,
                    gender: genderError || undefined
                });
                return;
            }
            setStep(prev => prev + 1);
        } else if (step === 3) {
            handlePayment();
        }
    };

    const handlePayment = async () => {
        if (!psychologist) return;
        setLoading(true);
        try {
            // Note: Availability is now checked in the UI (disabled slots)
            // But we still do a final check here as a safety measure
            const { checkAvailability } = await import("@/app/lib/actions/bookings");

            // Construct start time to check
            // Force IST Timezone construction (UTC+05:30) regardless of client local time
            const dateStr = bookingData.date!.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local time (which matches the selected date object's day)
            // Note: bookingData.date is created as "00:00 Local". toLocaleDateString('en-CA') gives "YYYY-MM-DD".

            const [timePart, meridiem] = bookingData.time!.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;

            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

            // Create Date object specifically for IST (UTC+05:30)
            const istISO = `${dateStr}T${timeStr}+05:30`;
            const startTime = new Date(istISO);

            const isAvailable = await checkAvailability(psychologist.id, startTime.toISOString());

            if (!isAvailable) {
                alert("Sorry, this slot is no longer available. Please select another time.");
                setLoading(false);
                return;
            }

            // 1. Create Order
            const amount = selectedPackage ? selectedPackage.price : psychologist.price;
            const response = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount, currency: "INR" }),
            });
            const order = await response.json();

            if (order.error) {
                alert("Payment initialization failed");
                setLoading(false);
                return;
            }

            const fullPhone = `${bookingData.countryCode}${bookingData.phone}`;

            // 2. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Her MindMate",
                description: selectedPackage ? `Package: ${selectedPackage.name}` : `Consultation with ${psychologist.name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. On Success (In real app: Verify signature here via API call)
                    // Move to Step 4 (Consent)
                    setPaymentId(response.razorpay_payment_id);
                    setStep(4);
                    setLoading(false); // Stop loading so user can interact with consent form
                },
                prefill: {
                    name: bookingData.name,
                    email: bookingData.email,
                    contact: fullPhone,
                },
                theme: {
                    color: "#0d9488", // Primary color (Teal)
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        router.push("/payment-failed?reason=cancelled");
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response: any) {
                console.error("Payment Failed", response.error);
                router.push("/payment-failed?reason=failed");
            });

            rzp1.open();

            // We keep loading true while payment modal is open
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong");
            setLoading(false);
        }
    };

    const handleConsentSubmit = async () => {
        if (!psychologist || !paymentId || !bookingData.date || !bookingData.time) return;

        if (!consentData.name || !consentData.signature || !consentData.date || !consentData.agreed) {
            alert("Please complete all consent fields.");
            return;
        }

        setLoading(true);
        try {
            // Re-construct start time (same logic as before)
            const dateStr = bookingData.date.toLocaleDateString('en-CA');
            const [timePart, meridiem] = bookingData.time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            const istISO = `${dateStr}T${timeStr}+05:30`;
            const startTime = new Date(istISO);

            const fullPhone = `${bookingData.countryCode}${bookingData.phone}`;
            const amount = selectedPackage ? selectedPackage.price : psychologist.price;
            const packageDetails = selectedPackage ? JSON.stringify({
                id: selectedPackage.id,
                name: selectedPackage.name,
                session_count: selectedPackage.session_count
            }) : null;

            const { createBooking } = await import("@/app/lib/actions/bookings");

            const booking = await createBooking({
                psychologist_id: psychologist.id,
                user_name: bookingData.name,
                user_email: bookingData.email,
                user_phone: fullPhone,
                user_job_status: bookingData.jobStatus,
                user_is_physically_challenged: bookingData.physicallyChallenged === "yes",
                user_gender: bookingData.gender,
                start_time: startTime.toISOString(),
                amount: amount,
                payment_id: paymentId,
                payment_status: 'captured',
                status: 'confirmed',
                package_details: packageDetails // Type bypass via 'as any' handled on function or object level if needed
            } as any);

            router.push(`/success?bookingId=${booking.id}`);
        } catch (err) {
            console.error("Booking creation failed", err);
            alert("Booking failed. Please contact support.");
            setLoading(false);
        }
    };

    if (isLoadingPsychologist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!psychologist) return notFound();

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                    <h1 className="text-2xl font-bold">Book Appointment</h1>
                    <p className="text-muted-foreground">with {psychologist.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Steps Indicator */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {step === 1 && "Select Date & Time"}
                                    {step === 2 && "Your Details"}
                                    {step === 3 && "Review & Pay"}
                                    {step === 4 && "Informed Consent"}
                                </CardTitle>
                                <CardDescription>
                                    Step {step} of 4
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {step === 1 && (
                                    <div className="space-y-8">
                                        {/* Service Selection */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">Select Service Plan</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Single Session Option */}
                                                <div
                                                    onClick={() => setSelectedPackage(null)}
                                                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedPackage === null
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                        : "border-muted hover:border-primary/50"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-medium">Single Session</span>
                                                        <div className={`w-4 h-4 rounded-full border border-primary flex items-center justify-center ${selectedPackage === null ? "bg-primary" : ""}`}>
                                                            {selectedPackage === null && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-2xl font-bold text-foreground">₹{psychologist.price}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">1 session • 60 mins</p>
                                                </div>

                                                {/* Dynamic Packages */}
                                                {psychologist.packages?.map((pkg: any) => (
                                                    <div
                                                        key={pkg.id}
                                                        onClick={() => setSelectedPackage(pkg)}
                                                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedPackage?.id === pkg.id
                                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                            : "border-muted hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium">{pkg.name}</span>
                                                            {pkg.session_count > 1 && (
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                                    {pkg.session_count} Sessions
                                                                </span>
                                                            )}
                                                            <div className={`w-4 h-4 rounded-full border border-primary flex items-center justify-center ${selectedPackage?.id === pkg.id ? "bg-primary" : ""}`}>
                                                                {selectedPackage?.id === pkg.id && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                        </div>
                                                        <p className="text-2xl font-bold text-foreground">₹{pkg.price}</p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {Math.round(pkg.price / pkg.session_count)}/session
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t pt-6">
                                            <h3 className="font-semibold text-lg mb-4">Select Date & Time</h3>
                                            <DateSelection
                                                onSelect={handleDateSelect}
                                                selectedDate={bookingData.date}
                                                selectedTime={bookingData.time}
                                                bookedSlots={bookedSlots}
                                                psychologistId={psychologist?.id}
                                                psychologist={psychologist}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={bookingData.name}
                                                onChange={handleInputChange}
                                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                                            />
                                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={bookingData.email}
                                                onChange={handleInputChange}
                                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                            />
                                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                            <div className="flex gap-2">
                                                {bookingData.countryCode === "custom" || (bookingData.countryCode !== "+91" && !["+973", "+965", "+968", "+974", "+966", "+971"].includes(bookingData.countryCode)) ? (
                                                    <div className="relative">
                                                        <Input
                                                            name="countryCode"
                                                            placeholder="+1"
                                                            value={bookingData.countryCode === "custom" ? "" : bookingData.countryCode}
                                                            onChange={handleInputChange}
                                                            className="w-[100px]"
                                                        />
                                                        <button
                                                            onClick={() => setBookingData(prev => ({ ...prev, countryCode: "+91" }))}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                                                            title="Back to list"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <select
                                                        name="countryCode"
                                                        value={bookingData.countryCode}
                                                        onChange={(e) => {
                                                            if (e.target.value === "custom") {
                                                                setBookingData(prev => ({ ...prev, countryCode: "" })); // Clear for input
                                                            } else {
                                                                handleInputChange(e);
                                                            }
                                                        }}
                                                        className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="+91">+91 (IN)</option>
                                                        <option value="+973">+973 (BH)</option>
                                                        <option value="+965">+965 (KW)</option>
                                                        <option value="+968">+968 (OM)</option>
                                                        <option value="+974">+974 (QA)</option>
                                                        <option value="+966">+966 (SA)</option>
                                                        <option value="+971">+971 (AE)</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                )}
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="phone number"
                                                    value={bookingData.phone}
                                                    onChange={handleInputChange}
                                                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500 flex-1" : "flex-1"}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="gender" className="text-sm font-medium">Sex</label>
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    value={bookingData.gender}
                                                    onChange={handleInputChange}
                                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.gender ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                >
                                                    <option value="">Select Sex</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="jobStatus" className="text-sm font-medium">Job Status</label>
                                                <select
                                                    id="jobStatus"
                                                    name="jobStatus"
                                                    value={bookingData.jobStatus}
                                                    onChange={handleInputChange}
                                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.jobStatus ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Working">Working</option>
                                                    <option value="Home Maker">Home Maker</option>
                                                    <option value="Student">Student</option>
                                                    <option value="Retired">Retired</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.jobStatus && <p className="text-xs text-red-500">{errors.jobStatus}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Physically Challenged</label>
                                            <div className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="pc-yes"
                                                        name="physicallyChallenged"
                                                        value="yes"
                                                        checked={bookingData.physicallyChallenged === "yes"}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label htmlFor="pc-yes" className="text-sm">Yes</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="pc-no"
                                                        name="physicallyChallenged"
                                                        value="no"
                                                        checked={bookingData.physicallyChallenged === "no"}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label htmlFor="pc-no" className="text-sm">No</label>
                                                </div>
                                            </div>
                                            {errors.physicallyChallenged && <p className="text-xs text-red-500">{errors.physicallyChallenged}</p>}
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div className="bg-muted p-4 rounded-lg space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Professional</span>
                                                <span className="font-medium">{psychologist.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Date</span>
                                                <span className="font-medium">{bookingData.date?.toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Time</span>
                                                <span className="font-medium">{bookingData.time}</span>
                                            </div>
                                            {selectedPackage ? (
                                                <div className="flex justify-between font-medium text-primary">
                                                    <span>Package</span>
                                                    <span>{selectedPackage.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Service</span>
                                                    <span>Single Session</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 mt-2 flex justify-between">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-lg">
                                                    ₹{selectedPackage ? selectedPackage.price : psychologist.price}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button className="w-full bg-[#3395ff] hover:bg-[#2d84e4] text-white" onClick={handleNext} disabled={loading}>
                                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                                                Pay ₹{selectedPackage ? selectedPackage.price : psychologist.price}
                                            </Button>
                                            <p className="text-xs text-center text-muted-foreground">
                                                Secure payment handled by Razorpay.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="bg-muted/50 p-4 rounded-lg border text-sm text-muted-foreground h-64 overflow-y-auto space-y-4">
                                            <h3 className="font-semibold text-foreground">Her MindMate – Informed Consent for Online Counselling</h3>
                                            <p>All information shared during counselling sessions on Her MindMate is treated with strict confidentiality. Exceptions apply only in cases involving risk of harm to self or others, suspected abuse, legal or ethical obligations, or professional supervision (with identity protected).</p>
                                            <p>Counselling sessions are conducted online and typically last 45–60 minutes. The client understands the nature of online counselling and agrees to ensure a stable internet connection and a private, quiet space for sessions. Occasional technical disruptions may occur despite reasonable precautions.</p>
                                            <p>Payments for sessions can be made via UPI or Bank Transfer. An advance payment is required at the time of booking, after which the session will be confirmed.</p>
                                            <p>Cancellations or rescheduling must be made at least 24 hours in advance. Late cancellations or missed sessions may be handled as per platform policy.</p>
                                            <p className="font-medium text-foreground">By proceeding with the booking, you confirm that you understand the above information and voluntarily consent to participate in counselling services provided by Her MindMate.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="agree"
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    checked={consentData.agreed}
                                                    onChange={(e) => setConsentData(prev => ({ ...prev, agreed: e.target.checked }))}
                                                />
                                                <label htmlFor="agree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    I have read and agree to the above terms.
                                                </label>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Client / Guardian Name</label>
                                                    <Input
                                                        placeholder="Your Name"
                                                        value={consentData.name}
                                                        onChange={(e) => setConsentData(prev => ({ ...prev, name: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Date</label>
                                                    <Input
                                                        type="date"
                                                        value={consentData.date}
                                                        onChange={(e) => setConsentData(prev => ({ ...prev, date: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-medium">E-Signature (Type Full Name)</label>
                                                    <Input
                                                        placeholder="Type your full name to sign"
                                                        value={consentData.signature}
                                                        onChange={(e) => setConsentData(prev => ({ ...prev, signature: e.target.value }))}
                                                        className="font-sans"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-6">
                                <Button variant="outline" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || loading}>
                                    Back
                                </Button>
                                {step < 3 ? (
                                    <Button onClick={handleNext} disabled={(step === 1 && !bookingData.time) || (step === 2 && !bookingData.name)}>
                                        Continue
                                    </Button>
                                ) : step === 4 ? (
                                    <Button onClick={handleConsentSubmit} disabled={!consentData.agreed || !consentData.name || !consentData.signature || !consentData.date || loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                        Confirm Booking
                                    </Button>
                                ) : null}
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden relative">
                                            <img src={psychologist.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"} alt="" className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{psychologist.name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedPackage ? selectedPackage.name : "1 hr session"}</p>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{selectedPackage ? "Package Price" : "Subtotal"}</span>
                                            <span>₹{selectedPackage ? selectedPackage.price : psychologist.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Platform Fee</span>
                                            <span>₹0</span>
                                        </div>
                                        <div className="flex justify-between font-bold pt-2 border-t">
                                            <span>Total</span>
                                            <span>₹{selectedPackage ? selectedPackage.price : psychologist.price}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
