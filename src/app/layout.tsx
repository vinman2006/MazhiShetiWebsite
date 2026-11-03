import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/store";
import { FirebaseAuthProvider } from "@/lib/firebase-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mazhi Sheti — Digital Agricultural Ecosystem & Smart Soil Platform",
  description:
    "Comprehensive full-stack agricultural platform connecting farmers, agronomists, machinery providers, buyers, and financial institutions.",
  icons: {
    icon: "/assets/img/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 antialiased selection:bg-agri-green-900 selection:text-white">
        <AppStateProvider>
          <FirebaseAuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </FirebaseAuthProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
