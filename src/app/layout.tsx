import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Provide messages to the client
    const messages = await getMessages();

    return (
        <html lang="cs">
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}