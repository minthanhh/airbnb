import './globals.css';
import { Nunito } from 'next/font/google';

import { ClientOnly, Navbar } from './components';
import {
    RegisterModal,
    LoginModal,
    SearchModal,
    RentModal,
} from './components';
import { ToastProvider } from './providers';
import getCurrentUser from './actions/getCurrentUser';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata = {
    title: 'Airbnb',
    description: 'Airbnb clone',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    return (
        <html lang="en">
            <body className={nunito.className}>
                <ClientOnly>
                    <SearchModal />
                    <RentModal />
                    <LoginModal />
                    <RegisterModal />
                    <ToastProvider />
                    <Navbar currentUser={currentUser} />
                </ClientOnly>
                <div className="pb-20 pt-28">{children}</div>
            </body>
        </html>
    );
}
