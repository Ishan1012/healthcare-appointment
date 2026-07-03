"use client";
import { type ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<AuthProvider>
				{children}
				<Toaster position="bottom-right" richColors />
			</AuthProvider>
		</GoogleOAuthProvider>
	);
}
