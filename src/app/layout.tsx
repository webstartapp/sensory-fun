import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Provide messages to the client
    const messages = await getMessages();

    return (
        <html lang="cs">
            <body className="flex flex-col min-h-screen">
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    <main className="grow pt-16">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}