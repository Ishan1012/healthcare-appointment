'use client';
import React from 'react'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Profile = dynamic(() => import("@/components/Profile"), { ssr: false });

export default function ProfilePage() {
    return (
        <>
            <Header />
            <Profile />
        </>
    )
}
