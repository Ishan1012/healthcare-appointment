"use client";
import React from 'react'
import AboutPage from '@/page-components/AboutPage'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function About() {
  return (
    <>
      <Header />
      <AboutPage />
      <Footer />
    </>
  )
}
