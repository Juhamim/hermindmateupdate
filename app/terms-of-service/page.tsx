export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
                <div className="text-center pb-10">
                    <h1 className="font-sans text-4xl text-[#332d2b]">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mt-2">Last updated: Oct 1, 2025</p>
                </div>

                <div className="prose prose-stone prose-headings:font-sans prose-headings:font-normal prose-p:font-light prose-p:text-gray-600">
                    <p>
                        By accessing Her MindMate, you agree to these Terms of Service. Please read them carefully.
                    </p>
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        Using our services constitutes your acceptance of these terms. If you do not agree, please do not use our platform.
                    </p>
                    <h3>2. User Conduct</h3>
                    <p>
                        Users are expected to communicate respectfully with specialists and other community members. Harassment of any kind will not be tolerated.
                    </p>
                    <h3>3. Disclaimer</h3>
                    <p>
                        Mindmate provides a platform for connection but is not a substitute for emergency medical services. In case of emergency, please contact your local authorities immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
