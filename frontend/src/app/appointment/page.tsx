'use client';
import React from 'react'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const AppointmentPage = dynamic(() => import("@/pages/AppointmentPage"), { ssr: false });

export default function Appointment() {
  return (
    <>
      <Header />
      <AppointmentPage />
    </>
  )
}
