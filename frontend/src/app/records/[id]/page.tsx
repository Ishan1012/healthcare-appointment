'use client';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';
import { RecordDetails } from '@/types/type';
import { toast } from 'sonner';
import { getRecordApi } from '@/apis/apis';
import LoadingSpinner from '@/pages/LoadingPage';
import { useParams } from 'next/navigation';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const RecordDescription = dynamic(() => import("@/components/RecordDescription"), { ssr: false });

export default function RecordDetailsPage() {
    const params = useParams();
    const [record, setRecord] = useState<Omit<RecordDetails, 'id'> & { status: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const id = params?.id as string;

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await getRecordApi(id);
                setRecord(response.data.record as Omit<RecordDetails, 'id'> & { status: string });
            } catch (error) {
                console.error(String(error));
                toast.error("Failed to load medical record details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecord();
        }
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!record) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <p className="text-xl text-slate-655">Could not load medical record.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <RecordDescription details={record} />
            <Footer />
        </>
    );
}
