import { Metadata } from 'next';
import { ContactSection } from '@/app/components/landing/ContactSection';

export const metadata: Metadata = {
    title: 'Contact Us - Her MindMate',
    description: 'Get in touch with us. We are here to listen and support you.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9] pt-20">
            <ContactSection />
        </div>
    );
}
