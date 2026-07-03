'use client';
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const LandingPage = dynamic(() => import("@/components/LandingPage"), { ssr: false });

export default function Home() {
  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
    </>
  );
}
