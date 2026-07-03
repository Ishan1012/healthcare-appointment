'use client';
import React from 'react'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const LoginForm = dynamic(() => import("@/components/LoginForm"), { ssr: false });

export default function Login() {
  return (
    <>
      <Header />
      <LoginForm />
      <Footer />
    </>
  );
}
