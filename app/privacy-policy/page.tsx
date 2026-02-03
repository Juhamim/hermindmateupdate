export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
                <div className="text-center pb-10">
                    <h1 className="font-sans text-4xl text-[#332d2b]">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Last updated: Oct 1, 2025</p>
                </div>

                <div className="prose prose-stone prose-headings:font-sans prose-headings:font-normal prose-p:font-light prose-p:text-gray-600">
                    <p>
                        Your privacy is of paramount importance to us. This policy outlines how Her MindMate collects, uses, and protects your personal information.
                    </p>
                    <h3>1. Information Collection</h3>
                    <p>
                        We collect information necessary to provide our services, including but not limited to name, contact details, and session history. All data is encrypted and stored securely.
                    </p>
                    <h3>2. Use of Information</h3>
                    <p>
                        Your data is used solely for the purpose of connecting you with specialists and improving your experience on our platform. We do not sell your data to third parties.
                    </p>
                    <h3>3. Data Protection</h3>
                    <p>
                        We implement industry-standard security measures to safeguard your personal information against unauthorized access or disclosure.
                    </p>
                    {/* Add more sections as needed */}
                </div>
            </div>
        </div>
    );
}
