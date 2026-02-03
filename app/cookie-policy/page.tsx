export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
                <div className="text-center pb-10">
                    <h1 className="font-sans text-4xl text-[#332d2b]">Cookie Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Effective Date: Oct 1, 2025</p>
                </div>

                <div className="prose prose-stone prose-headings:font-sans prose-headings:font-normal prose-p:font-light prose-p:text-gray-600">
                    <p>
                        We use cookies to enhance your browsing experience and analyze site traffic.
                    </p>
                    <h3>1. What Are Cookies?</h3>
                    <p>
                        Cookies are small text files stored on your device that help us remember your preferences and improve site functionality.
                    </p>
                    <h3>2. How We Use Cookies</h3>
                    <p>
                        We use both session and persistent cookies to authenticate users, personalize content, and analyze our traffic patterns.
                    </p>
                    <h3>3. Managing Cookies</h3>
                    <p>
                        You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.
                    </p>
                </div>
            </div>
        </div>
    );
}
