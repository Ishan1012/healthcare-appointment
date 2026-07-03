'use client';
import React from 'react'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const RegisterForm = dynamic(() => import("@/components/RegisterForm"), { ssr: false });

export default function Doctor() {
  return (
    <>
      <Header />
      <RegisterForm userType="Patient" />
      <Footer />
    </>
  );
}
