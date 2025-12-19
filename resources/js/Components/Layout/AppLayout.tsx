import { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps extends PropsWithChildren {
    userName?: string;
    userAvatar?: string;
}

export default function AppLayout({ children, userName, userAvatar }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} userAvatar={userAvatar} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
