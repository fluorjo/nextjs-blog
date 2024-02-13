import Footer from '@/components/Footers';
import Header from '@/components/Headers';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';
import { cn } from '@/utils/style';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ReactNode, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export default function App({ children }: children:ReactNode) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <QueryClientProvider client={queryClient}>
            <div
                className={cn(
                    'flex h-screen w-screen text-sm lg:text-base',
                    inter.className,
                )}
            >
                <Sidebar
                    close={() => setIsSidebarOpen(false)}
                    isOpen={isSidebarOpen}
                />
                <div className="flex flex-1 flex-col">
                    <Header
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        <main className="flex-1">
                            <Component {...pageProps} />
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
}
