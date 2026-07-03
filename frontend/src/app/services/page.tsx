'use client';
import React from 'react'
import ServicesPage from '@/page-components/ServicesPage'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function Services() {
  return (
    <>
      <Header />
      <ServicesPage />
      <Footer />
    </>
  )
}
