'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/query-client';
import { MessProvider } from '@/contexts/MessContext';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <ThemeProvider defaultTheme="dark" storageKey="amar-dera-theme">
                    <MessProvider>
                        {children}
                    </MessProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'var(--popover)',
                                color: 'var(--popover-foreground)',
                                border: '1px solid var(--border)',
                            },
                            success: {
                                iconTheme: {
                                    primary: 'var(--primary)',
                                    secondary: 'var(--primary-foreground)',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: 'var(--destructive)',
                                    secondary: 'var(--destructive-foreground)',
                                },
                            },
                        }}
                    />
                </ThemeProvider>
            </GoogleOAuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
