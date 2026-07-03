'use client';
import Footer from '@/components/Footer'
import React from 'react'
import dynamic from 'next/dynamic';
import PatientRegistration from '@/components/PatientRegistration';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function PatientRegistrationPage() {
  return (
    <>
      <Header />
      <PatientRegistration />
      <Footer />
    </>
  );
}
