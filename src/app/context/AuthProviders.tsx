'use client'
import { SessionProvider } from "next-auth/react";

export function AuthProviders({ children, session }: { children: React.ReactNode, session: string }) {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
    )
}