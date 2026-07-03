'use client';
import Footer from '@/components/Footer'
import DoctorRegistration from '@/components/DoctorRegistration'
import React from 'react'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function DoctorRegistrationPage() {
  return (
    <>
      <Header />
      <DoctorRegistration />
      <Footer />
    </>
  );
}
